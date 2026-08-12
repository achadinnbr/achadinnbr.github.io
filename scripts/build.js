/**
 * Build Script - Gera index.html a partir da Tabela de Produtos no Notion
 *
 * Uso:
 *   NOTION_API_TOKEN=ntn_xxx NOTION_DATABASE_ID=xxx npm run build
 *
 * Variáveis de ambiente:
 *   - NOTION_API_TOKEN: Token da integração Notion
 *   - NOTION_DATABASE_ID: ID da database "Tabela de Produtos"
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// --- Configuração ---
const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_TOKEN || !NOTION_DATABASE_ID) {
  console.error('❌ Variáveis NOTION_API_TOKEN e NOTION_DATABASE_ID são obrigatórias.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_TOKEN });

// --- Mapeamento de plataformas ---
const PLATFORM_MAP = {
  'Shopee': { class: 'shopee', logo: 'assets/logos/shopee.webp', alt: 'Shopee' },
  'Mercado Livre': { class: 'mercado-livre', logo: 'assets/logos/mercadolivre.webp', alt: 'Mercado Livre' },
  'Amazon': { class: 'amazon', logo: 'assets/logos/amazon.webp', alt: 'Amazon' },
};

// --- Funções auxiliares ---
function getPlainText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map(t => t.plain_text).join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Gera uma descrição genérica do produto para exibir no site.
 * Usa truncamento inteligente: identifica o tipo do produto e descarta
 * marca, modelo e specs para evitar que o cliente busque diretamente na loja.
 *
 * Formato: "Descrição curta (Categoria)"
 * Exemplos:
 *   "Kit Cera Blend Spray Black Vonixx..." → "Kit Cera Spray (Automotivo)"
 *   "Samsung Galaxy Buds Core, Fone de..." → "Fone de Ouvido (Tecnologia)"
 *   "Bike Ergométrica 8kg Fitness com..." → "Bike Ergométrica (Fitness & Esporte)"
 */
function gerarDescricaoGenerica(nomeCompleto, categoria) {
  // Passo 1: Separar por vírgulas, hífens ou pipes
  const trechos = nomeCompleto.split(/\s*[,\-–|]\s*/);

  // Passo 2: Encontrar o trecho mais genérico (tipo do produto)
  const palavrasGenericas = /^(kit|fone|tênis|tenis|bike|bicicleta|cera|creatina|whey|luminária|luminaria|aspirador|panela|mochila|relógio|relogio|smartwatch|caixa|suporte|cabo|carregador|mouse|teclado|monitor|cadeira|mesa|tapete|escova|secador|fritadeira|air\s*fryer|smart\s*speaker|speaker|caixa\s*de\s*som)/i;

  let descBase = trechos[0];
  for (const trecho of trechos) {
    const limpo = trecho.trim();
    if (palavrasGenericas.test(limpo)) {
      descBase = limpo;
      break;
    }
  }

  // Passo 3: Pipeline de limpeza
  let desc = descBase
    // Remove marcas
    .replace(/\b(Samsung|Apple|Xiaomi|JBL|QCY|Vonixx|Broox|Soldiers|Squeeze|Sony|LG|Philips|Mondial|Electrolux|Tramontina|Nike|Adidas|Puma|Galaxy|iPhone|Echo\s*Dot|Alexa|Google|Anker|Baseus|Logitech|Razer|HyperX|Buds|Core)\b/gi, '')
    // Remove codes/modelos alfanuméricos (G502, B09ZZ4, T13)
    .replace(/\b[A-Z]\d{2,}[A-Z0-9]*\b/g, '')
    // Remove specs numéricas (8kg, 4.1L, 5000mah, 25600 DPI etc)
    .replace(/\b\d+[\.,]?\d*\s*(kg|g|ml|l|w|watts|mah|gb|tb|mm|cm|pol|"|litros?|metros?|dpi)\b/gi, '')
    // Remove "100%" especificamente
    .replace(/100%/g, '')
    // Remove números soltos no início
    .replace(/^\d+\s+/g, '')
    // Remove termos de marketing, specs e modelos
    .replace(/\b(Pro|Max|Plus|Ultra|Premium|Original|Oficial|Genuíno|Importado|Nacional|Pura|Puro|Monohidratada|Vitrificadora|Blend|Digital|Inteligente|Hero|Turbo|Lite)\b/gi, '')
    // Remove "com" + tudo depois
    .replace(/\s+com\s+.*/i, '')
    // Remove termos de entrega/versão
    .replace(/\b(Envio\s*Imediato|Frete\s*Gr[aá]tis|Pronta\s*Entrega|Black|Edition|Geração|Microfibra)\b/gi, '')
    // Remove tudo após "+" (complementos)
    .replace(/\+.*/g, '')
    // Limpa espaços e pontuação solta
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*[+\-,.\s]+/, '')
    .replace(/[+\-,.\s]+\s*$/, '')
    .trim();

  // Passo 4: Limitar a 4 palavras (5 se termina com "sem fio", "sem ruído" etc)
  const palavras = desc.split(/\s+/).filter(p => p.length > 0);
  let maxPalavras = 4;
  if (palavras.length > 4 && palavras[3] === 'sem') {
    maxPalavras = 5; // mantém "sem fio", "sem ruído"
  }
  if (palavras.length > maxPalavras) {
    desc = palavras.slice(0, maxPalavras).join(' ');
  } else {
    desc = palavras.join(' ');
  }

  // Remove números soltos que sobraram em qualquer posição
  desc = desc.replace(/\b\d+\b/g, '').replace(/\s{2,}/g, ' ').trim();

  // Passo 5: Fallback se ficou vazio ou muito curto
  if (desc.length < 3) {
    // Usa primeiras 3 palavras do nome, removendo marcas óbvias
    const fallback = nomeCompleto
      .replace(/\b(Samsung|Apple|Xiaomi|Galaxy|iPhone)\b/gi, '')
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join(' ');
    desc = fallback;
  }

  // Passo 6: Capitalizar
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);

  if (categoria) {
    return `${desc} (${categoria})`;
  }
  return desc;
}

// --- Buscar produtos do Notion ---
async function fetchProducts() {
  const results = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Status',
        select: { equals: 'Publicado' },
      },
      sorts: [
        { property: 'Código', direction: 'ascending' },
      ],
      start_cursor: cursor,
    });

    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return results.map(page => {
    const props = page.properties;
    const nome = getPlainText(props['Nome do Produto']?.title);
    const categoria = props['Categoria']?.select?.name || '';

    // Gera descrição genérica para o site (evita bypass do link de afiliado)
    // Formato: descrição curta sem marca/modelo exato + categoria
    const descricaoSite = gerarDescricaoGenerica(nome, categoria);

    return {
      codigo: getPlainText(props['Código']?.rich_text),
      nome: nome,
      descricaoSite: descricaoSite,
      categoria: categoria,
      plataforma: props['Plataforma']?.select?.name || '',
      link: props['Link de Afiliado']?.url || '#',
    };
  });
}

// --- Gerar HTML de um link ---
function renderLink(product) {
  const platform = PLATFORM_MAP[product.plataforma];
  if (!platform) {
    console.warn(`⚠️  Plataforma desconhecida: "${product.plataforma}" para ${product.codigo}`);
    return '';
  }

  const displayName = product.codigo
    ? `${product.codigo} - ${product.descricaoSite}`
    : product.descricaoSite;

  return `      <a href="${escapeHtml(product.link)}" target="_blank" rel="noopener noreferrer" class="link-btn ${platform.class}">
        <span class="link-icon">
          <img src="${platform.logo}" alt="${platform.alt}" width="24" height="24">
        </span>
        <span class="link-text">${escapeHtml(displayName)}</span>
      </a>`;
}

// --- Gerar página completa ---
function renderPage(products) {
  const linksHtml = products
    .map(renderLink)
    .filter(Boolean)
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Achadin BR - Ofertas e Produtos</title>
  <meta name="description" content="Encontre as melhores ofertas de produtos na Shopee, Mercado Livre e Amazon. Links diretos para as melhores promoções!">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Achadin BR - Ofertas e Produtos">
  <meta property="og:description" content="Links diretos para as melhores ofertas em Shopee, Mercado Livre e Amazon.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/logo.jpeg">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>">
  
  <!-- Google Fonts - Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    
    <header class="header">
      <img src="assets/logo.jpeg" alt="Achadin BR" class="avatar" width="96" height="96">
      <h1 class="brand-name">Achadin BR</h1>
      <div class="brand-handle-wrapper">
        <img src="assets/logos/instagram.webp" alt="Instagram" width="30" height="30" class="brand-handle-icon">
        <a href="https://instagram.com/achadinn_br" target="_blank" rel="noopener noreferrer" class="brand-handle">@achadinn_br</a>
      </div>
      <p class="brand-description">As melhores ofertas de produtos selecionados para você!</p>
    </header>

    <div class="search-box">
      <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" id="search" class="search-input" placeholder="Buscar por código ou nome..." aria-label="Buscar links">
    </div>

    <section class="links" aria-label="Links de produtos">
      
${linksHtml}

    </section>

    <footer class="footer">
      <p>Achadin BR &copy; 2026 &bull; Todos os links verificados</p>
    </footer>

  </div>

  <script>
    document.getElementById('search').addEventListener('input', function () {
      var termo = this.value.toLowerCase();
      var links = document.querySelectorAll('.link-btn');
      links.forEach(function (link) {
        var texto = link.querySelector('.link-text').textContent.toLowerCase();
        link.style.display = texto.includes(termo) ? '' : 'none';
      });
    });
  </script>
</body>
</html>
`;
}

// --- Main ---
async function main() {
  console.log('🔄 Buscando produtos do Notion...');
  const products = await fetchProducts();
  console.log(`✅ ${products.length} produto(s) encontrado(s) com status "Publicado"`);

  if (products.length === 0) {
    console.warn('⚠️  Nenhum produto com status "Publicado". Página será gerada sem links.');
  }

  const html = renderPage(products);
  const outputPath = path.join(__dirname, '..', 'index.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`📄 index.html gerado com sucesso! (${products.length} links)`);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
