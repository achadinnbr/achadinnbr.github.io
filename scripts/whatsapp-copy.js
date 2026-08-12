/**
 * WhatsApp Copy Generator - Gerador de copy formatada para WhatsApp
 *
 * Gera textos prontos para colar no WhatsApp com formatação nativa:
 *   - *negrito* para destaques
 *   - Emojis para chamar atenção
 *   - Texto curto e direto (sem hashtags, sem markdown)
 *
 * Uso como módulo:
 *   const { generateWhatsAppCopy } = require('./whatsapp-copy');
 *   const copy = generateWhatsAppCopy({ nome, preco, link, plataforma, categoria });
 *
 * Uso direto (CLI):
 *   node scripts/whatsapp-copy.js --nome "Echo Dot 5" --preco 299 --link "https://..." --plataforma amazon
 */

// ============================================================
// TEMPLATES DE COPY POR TIPO
// ============================================================

/**
 * Emojis por categoria de produto
 */
const CATEGORY_EMOJIS = {
  'Tecnologia': ['🔥', '⚡', '💥', '🚀', '📱'],
  'Casa & Organização': ['🏠', '✨', '🧹', '💡', '🏡'],
  'Automotivo': ['🚗', '🏎️', '⚡', '🔧', '💨'],
  'Beleza': ['💄', '✨', '💅', '🌸', '💆'],
  'Moda': ['👕', '👗', '🛍️', '✨', '💎'],
  'Esportes': ['⚽', '🏋️', '🏃', '💪', '🎯'],
  'default': ['🔥', '⚡', '💥', '✨', '🚀'],
};

/**
 * Emojis de urgência/CTA
 */
const CTA_EMOJIS = ['👇', '🔗', '➡️', '📲', '🛒'];

/**
 * Emojis de preço/desconto
 */
const PRICE_EMOJIS = ['💰', '🤑', '💸', '🏷️', '💲'];

/**
 * Seleciona emoji aleatório de um array
 */
function pickEmoji(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Formata preço em Real
 */
function formatPrice(preco) {
  if (!preco) return null;
  const num = typeof preco === 'string' ? parseFloat(preco.replace(',', '.').replace(/[^\d.]/g, '')) : preco;
  if (isNaN(num)) return null;
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
}

// ============================================================
// GERADORES DE COPY
// ============================================================

/**
 * Gera copy modelo "Oferta Direta" - curta e objetiva
 */
function templateOfertaDireta({ nome, preco, link, plataforma, categoria }) {
  const catEmojis = CATEGORY_EMOJIS[categoria] || CATEGORY_EMOJIS['default'];
  const emoji1 = pickEmoji(catEmojis);
  const emojiCta = pickEmoji(CTA_EMOJIS);
  const precoFormatado = formatPrice(preco);

  let copy = `${emoji1} *${nome}*\n`;

  if (precoFormatado) {
    copy += `${pickEmoji(PRICE_EMOJIS)} Por apenas *${precoFormatado}*\n`;
  }

  if (plataforma) {
    copy += `🛍️ _${plataforma}_\n`;
  }

  copy += `\n${emojiCta} *Compre aqui:*\n${link}`;

  return copy;
}

/**
 * Gera copy modelo "Urgência" - com senso de escassez
 */
function templateUrgencia({ nome, preco, link, plataforma, categoria }) {
  const catEmojis = CATEGORY_EMOJIS[categoria] || CATEGORY_EMOJIS['default'];
  const emoji1 = pickEmoji(catEmojis);
  const precoFormatado = formatPrice(preco);

  let copy = `🚨 *OFERTA RELÂMPAGO* 🚨\n\n`;
  copy += `${emoji1} *${nome}*\n`;

  if (precoFormatado) {
    copy += `💰 *${precoFormatado}* (enquanto durar o estoque!)\n`;
  }

  if (plataforma) {
    copy += `📦 ${plataforma}\n`;
  }

  copy += `\n⚡ Corre que acaba rápido!\n`;
  copy += `👇 *Link direto:*\n${link}`;

  return copy;
}

/**
 * Gera copy modelo "Recomendação" - tom pessoal
 */
function templateRecomendacao({ nome, preco, link, plataforma, categoria }) {
  const catEmojis = CATEGORY_EMOJIS[categoria] || CATEGORY_EMOJIS['default'];
  const emoji1 = pickEmoji(catEmojis);
  const precoFormatado = formatPrice(preco);

  let copy = `${emoji1} Achei um achado que vale a pena compartilhar:\n\n`;
  copy += `*${nome}*\n`;

  if (precoFormatado) {
    copy += `💸 Por *${precoFormatado}*\n`;
  }

  if (plataforma) {
    copy += `🛒 Disponível na _${plataforma}_\n`;
  }

  copy += `\n✅ Produto verificado!\n`;
  copy += `🔗 ${link}`;

  return copy;
}

/**
 * Gera copy modelo "Comparativo" - destaca o preço baixo
 */
function templatePreco({ nome, preco, link, plataforma, categoria }) {
  const precoFormatado = formatPrice(preco);

  let copy = `🏷️ *PREÇO BAIXO DETECTADO*\n\n`;
  copy += `📦 *${nome}*\n`;

  if (precoFormatado) {
    copy += `\n💰 *${precoFormatado}*\n`;
  }

  if (plataforma) {
    copy += `🛍️ ${plataforma}\n`;
  }

  copy += `\n➡️ Garanta o seu:\n${link}`;

  return copy;
}

// ============================================================
// MAPA DE TEMPLATES
// ============================================================

const TEMPLATES = {
  'oferta': templateOfertaDireta,
  'urgencia': templateUrgencia,
  'recomendacao': templateRecomendacao,
  'preco': templatePreco,
};

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

/**
 * Gera copy para WhatsApp
 * @param {object} options
 * @param {string} options.nome - Nome do produto
 * @param {number|string} options.preco - Preço (opcional)
 * @param {string} options.link - Link de afiliado
 * @param {string} options.plataforma - Nome da plataforma (Amazon, Shopee, Mercado Livre)
 * @param {string} options.categoria - Categoria do produto (opcional)
 * @param {string} options.template - Template específico (oferta|urgencia|recomendacao|preco) ou 'todos'
 * @returns {string|object} - Copy pronta ou objeto com todas as variações
 */
function generateWhatsAppCopy(options) {
  const { template = 'oferta' } = options;

  // Validação mínima
  if (!options.nome) {
    throw new Error('Nome do produto é obrigatório');
  }
  if (!options.link) {
    throw new Error('Link é obrigatório');
  }

  // Gera todos os templates
  if (template === 'todos') {
    const result = {};
    for (const [name, fn] of Object.entries(TEMPLATES)) {
      result[name] = fn(options);
    }
    return result;
  }

  // Gera template específico
  const fn = TEMPLATES[template];
  if (!fn) {
    throw new Error(`Template "${template}" não existe. Opções: ${TEMPLATE_NAMES.join(', ')}, todos`);
  }

  return fn(options);
}

// ============================================================
// EXPORTAÇÃO + CLI
// ============================================================

module.exports = { generateWhatsAppCopy, TEMPLATES, TEMPLATE_NAMES, formatPrice };

// Execução direta via CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  // Parse de argumentos simples (--chave valor)
  function parseArgs(args) {
    const parsed = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('--')) {
        const key = args[i].slice(2);
        const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
        parsed[key] = value;
        if (value !== true) i++;
      }
    }
    return parsed;
  }

  const params = parseArgs(args);

  if (!params.nome || !params.link) {
    console.log('');
    console.log('  WhatsApp Copy Generator');
    console.log('  =======================');
    console.log('');
    console.log('  Uso:');
    console.log('    node scripts/whatsapp-copy.js --nome "Produto" --link "https://..." [opcoes]');
    console.log('');
    console.log('  Parametros obrigatorios:');
    console.log('    --nome        Nome do produto');
    console.log('    --link        Link de afiliado');
    console.log('');
    console.log('  Parametros opcionais:');
    console.log('    --preco       Preco (ex: 45.90 ou "45,90")');
    console.log('    --plataforma  Amazon | Shopee | Mercado Livre');
    console.log('    --categoria   Tecnologia | Casa & Organizacao | Automotivo | etc');
    console.log('    --template    oferta | urgencia | recomendacao | preco | todos');
    console.log('');
    console.log('  Exemplo:');
    console.log('    node scripts/whatsapp-copy.js --nome "Echo Dot 5" --preco 299 --link "https://amzn.to/xxx" --plataforma Amazon --template todos');
    console.log('');
    process.exit(0);
  }

  const result = generateWhatsAppCopy({
    nome: params.nome,
    preco: params.preco,
    link: params.link,
    plataforma: params.plataforma || '',
    categoria: params.categoria || '',
    template: params.template || 'todos',
  });

  console.log('');

  if (typeof result === 'string') {
    console.log('  --- COPY PRONTA (copie abaixo) ---');
    console.log('');
    console.log(result);
    console.log('');
  } else {
    // Mostra todos os templates
    for (const [name, copy] of Object.entries(result)) {
      console.log(`  --- Template: ${name.toUpperCase()} ---`);
      console.log('');
      console.log(copy);
      console.log('');
      console.log('  ' + '-'.repeat(40));
      console.log('');
    }
  }
}
