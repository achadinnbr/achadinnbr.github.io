/**
 * Gerar Post WhatsApp - Script CLI unificado
 *
 * Fluxo completo:
 *   1. Recebe link do produto (copiado de outro canal/grupo)
 *   2. Detecta plataforma e converte para seu link de afiliado
 *   3. Gera copy formatada para WhatsApp (pronta para colar no seu canal)
 *
 * Uso:
 *   node scripts/gerar-post-whatsapp.js <URL> --nome "Produto" [--preco 99.90] [--categoria Tecnologia] [--template todos]
 *
 * Exemplo rápido:
 *   node scripts/gerar-post-whatsapp.js "https://www.amazon.com.br/dp/B09ZZ4JL5B" --nome "Echo Dot 5" --preco 299
 */

const { convertLink, detectPlatform } = require('./link-converter');
const { generateWhatsAppCopy, TEMPLATE_NAMES } = require('./whatsapp-copy');

// ============================================================
// PARSE DE ARGUMENTOS
// ============================================================

function parseArgs(args) {
  const parsed = { url: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
      if (value !== true) i++;
    } else if (!parsed.url) {
      // Primeiro argumento sem -- é a URL
      parsed.url = args[i];
    }
  }

  return parsed;
}

// ============================================================
// DISPLAY
// ============================================================

function printSeparator(label) {
  const line = '='.repeat(50);
  console.log('');
  console.log(`  ${line}`);
  if (label) console.log(`  ${label}`);
  console.log(`  ${line}`);
}

function printHelp() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════╗');
  console.log('  ║   GERAR POST WHATSAPP - Achadin BR              ║');
  console.log('  ╚══════════════════════════════════════════════════╝');
  console.log('');
  console.log('  Converte link + gera copy pronta para o WhatsApp.');
  console.log('');
  console.log('  USO:');
  console.log('    node scripts/gerar-post-whatsapp.js <URL> --nome "Produto" [opcoes]');
  console.log('');
  console.log('  PARAMETROS:');
  console.log('    <URL>           Link do produto (obrigatorio)');
  console.log('    --nome          Nome do produto (obrigatorio)');
  console.log('    --preco         Preco em reais (ex: 45.90)');
  console.log('    --categoria     Tecnologia | Casa & Organizacao | Automotivo | Beleza | Moda | Esportes');
  console.log('    --template      oferta | urgencia | recomendacao | preco | todos (padrao: todos)');
  console.log('');
  console.log('  EXEMPLOS:');
  console.log('');
  console.log('    # Amazon - link completo');
  console.log('    node scripts/gerar-post-whatsapp.js "https://www.amazon.com.br/dp/B09ZZ4JL5B" --nome "Echo Dot 5" --preco 299');
  console.log('');
  console.log('    # Shopee - link curto (copiado do grupo)');
  console.log('    node scripts/gerar-post-whatsapp.js "https://s.shopee.com.br/abc123" --nome "Fone Bluetooth" --preco 45.90 --categoria Tecnologia');
  console.log('');
  console.log('    # Mercado Livre - com template especifico');
  console.log('    node scripts/gerar-post-whatsapp.js "https://produto.mercadolivre.com.br/MLB-12345" --nome "Cera Vonixx" --preco 32 --template urgencia');
  console.log('');
  console.log('  FLUXO:');
  console.log('    1. Voce copia o link de outro canal/grupo');
  console.log('    2. Roda este script com nome e preco');
  console.log('    3. O script troca o link pelo seu de afiliado');
  console.log('    4. Gera copy formatada pra WhatsApp');
  console.log('    5. Voce copia e cola no seu canal');
  console.log('');
  console.log('  CONFIGURACAO:');
  console.log('    Edite suas tags de afiliado em: scripts/link-converter.js (AFFILIATE_TAGS)');
  console.log('');
}

// ============================================================
// MAIN
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const params = parseArgs(args);

  // Sem argumentos = help
  if (args.length === 0 || params.help) {
    printHelp();
    process.exit(0);
  }

  // Validações
  if (!params.url) {
    console.error('  ❌ URL do produto é obrigatória. Use --help para ver exemplos.');
    process.exit(1);
  }

  if (!params.nome) {
    console.error('  ❌ Nome do produto é obrigatório (--nome "Nome do Produto").');
    process.exit(1);
  }

  // --- Passo 1: Converter link ---
  printSeparator('1. CONVERSAO DO LINK');

  const linkResult = convertLink(params.url);

  console.log(`  Plataforma:    ${linkResult.platformName}`);
  console.log(`  Link original: ${linkResult.originalUrl || params.url}`);
  console.log(`  Link afiliado: ${linkResult.url}`);

  if (linkResult.warning) {
    console.log(`  ⚠️  ${linkResult.warning}`);
  }
  if (linkResult.note) {
    console.log(`  ℹ️  ${linkResult.note}`);
  }

  // --- Passo 2: Gerar copy ---
  const template = params.template || 'todos';

  printSeparator('2. COPY PARA WHATSAPP');

  const copyResult = generateWhatsAppCopy({
    nome: params.nome,
    preco: params.preco,
    link: linkResult.url,
    plataforma: linkResult.platformName !== 'Desconhecida' ? linkResult.platformName : (params.plataforma || ''),
    categoria: params.categoria || '',
    template,
  });

  if (typeof copyResult === 'string') {
    // Template único
    console.log('');
    console.log('  Copie o texto abaixo e cole no seu canal:');
    console.log('  ' + '-'.repeat(44));
    console.log('');
    console.log(copyResult);
    console.log('');
  } else {
    // Todos os templates
    console.log('');
    console.log('  Escolha o melhor template e copie:');

    for (const [name, copy] of Object.entries(copyResult)) {
      console.log('');
      console.log(`  ┌── ${name.toUpperCase()} ${'─'.repeat(Math.max(0, 40 - name.length))}┐`);
      console.log('');
      // Indenta cada linha da copy
      copy.split('\n').forEach(line => {
        console.log(`  ${line}`);
      });
      console.log('');
      console.log(`  └${'─'.repeat(46)}┘`);
    }
  }

  // --- Resumo final ---
  printSeparator('RESUMO');
  console.log(`  Produto:     ${params.nome}`);
  console.log(`  Plataforma:  ${linkResult.platformName}`);
  if (params.preco) console.log(`  Preco:       R$ ${params.preco}`);
  console.log(`  Link final:  ${linkResult.url}`);
  console.log(`  Templates:   ${template === 'todos' ? TEMPLATE_NAMES.join(', ') : template}`);
  console.log('');
  console.log('  ✅ Pronto! Copie a copy acima e cole no seu canal WhatsApp.');
  console.log('');
}

main();
