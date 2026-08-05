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
    return {
      codigo: getPlainText(props['Código']?.rich_text),
      nome: getPlainText(props['Nome do Produto']?.title),
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
    ? `${product.codigo} - ${product.nome}`
    : product.nome;

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
      <a href="https://instagram.com/achadinn_br" target="_blank" rel="noopener noreferrer" class="brand-handle">@achadinn_br</a>
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
