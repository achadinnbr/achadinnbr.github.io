/**
 * Link Converter - Conversor de links de afiliado
 *
 * Recebe um link de produto (Amazon, Shopee, Mercado Livre) e reconstrói
 * com a tag de afiliado do usuário.
 *
 * Configuração:
 *   Edite as constantes AFFILIATE_TAGS abaixo com suas tags reais.
 *
 * Uso como módulo:
 *   const { convertLink, detectPlatform } = require('./link-converter');
 *   const resultado = convertLink('https://www.amazon.com.br/dp/B09ZZ4...');
 *
 * Uso direto (CLI):
 *   node scripts/link-converter.js "https://www.amazon.com.br/dp/B09ZZ4..."
 */

// ============================================================
// CONFIGURAÇÃO - Coloque suas tags de afiliado aqui
// ============================================================
const AFFILIATE_TAGS = {
  amazon: 'achadinnbr-20',         // Tag do Amazon Associates
  shopee: '',                       // ID de afiliado Shopee (usado no link de redirect)
  mercadolivre: '',                 // ID de afiliado ML (usado no link de redirect)
};

// ============================================================
// DETECÇÃO DE PLATAFORMA
// ============================================================

/**
 * Detecta a plataforma (loja) a partir de uma URL
 * @param {string} url - URL do produto
 * @returns {{ platform: string, name: string } | null}
 */
function detectPlatform(url) {
  const normalized = url.toLowerCase();

  // Amazon
  if (
    normalized.includes('amazon.com.br') ||
    normalized.includes('amzn.to') ||
    normalized.includes('amzn.com')
  ) {
    return { platform: 'amazon', name: 'Amazon' };
  }

  // Shopee
  if (
    normalized.includes('shopee.com.br') ||
    normalized.includes('s.shopee.com.br') ||
    normalized.includes('shp.ee')
  ) {
    return { platform: 'shopee', name: 'Shopee' };
  }

  // Mercado Livre
  if (
    normalized.includes('mercadolivre.com.br') ||
    normalized.includes('produto.mercadolivre') ||
    normalized.includes('lista.mercadolivre')
  ) {
    return { platform: 'mercadolivre', name: 'Mercado Livre' };
  }

  return null;
}

// ============================================================
// EXTRAÇÃO DE ID DO PRODUTO
// ============================================================

/**
 * Extrai o ID/ASIN do produto Amazon a partir da URL
 * Padrões reconhecidos:
 *   - /dp/ASIN
 *   - /gp/product/ASIN
 *   - /product/ASIN
 *   - amzn.to/SHORTCODE (mantém o short link, apenas adiciona tag)
 */
function extractAmazonId(url) {
  // Padrão /dp/ASIN
  const dpMatch = url.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dpMatch) return { type: 'asin', id: dpMatch[1] };

  // Padrão /gp/product/ASIN
  const gpMatch = url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (gpMatch) return { type: 'asin', id: gpMatch[1] };

  // Padrão genérico /product/ASIN
  const prodMatch = url.match(/\/product\/([A-Z0-9]{10})/i);
  if (prodMatch) return { type: 'asin', id: prodMatch[1] };

  // Short link amzn.to/XXXXX (não dá pra extrair ASIN sem resolver o redirect)
  const shortMatch = url.match(/amzn\.to\/([A-Za-z0-9]+)/);
  if (shortMatch) return { type: 'short', id: shortMatch[1] };

  return null;
}

/**
 * Extrai o ID do produto Shopee
 * Padrões:
 *   - /produto-nome-i.SHOP_ID.ITEM_ID
 *   - s.shopee.com.br/SHORTCODE
 *   - shp.ee/SHORTCODE
 */
function extractShopeeId(url) {
  // Padrão completo: i.SHOP_ID.ITEM_ID
  const fullMatch = url.match(/i\.(\d+)\.(\d+)/);
  if (fullMatch) return { type: 'full', shopId: fullMatch[1], itemId: fullMatch[2] };

  // Short links
  const shortMatch = url.match(/(?:s\.shopee\.com\.br|shp\.ee)\/([A-Za-z0-9]+)/);
  if (shortMatch) return { type: 'short', id: shortMatch[1] };

  return null;
}

/**
 * Extrai o ID do produto Mercado Livre
 * Padrão: MLB-XXXXXXXXX ou MLB1234567890
 */
function extractMercadoLivreId(url) {
  // Padrão MLB-XXXXXXX ou MLBXXXXXXX
  const mlbMatch = url.match(/(MLB[-]?\d+)/i);
  if (mlbMatch) return { type: 'mlb', id: mlbMatch[1] };

  return null;
}

// ============================================================
// RECONSTRUÇÃO DO LINK COM TAG DE AFILIADO
// ============================================================

/**
 * Reconstrói link Amazon com tag de afiliado
 */
function buildAmazonLink(extracted, originalUrl) {
  const tag = AFFILIATE_TAGS.amazon;

  if (!tag) {
    return { url: originalUrl, warning: 'Tag Amazon não configurada. Edite AFFILIATE_TAGS em link-converter.js' };
  }

  if (extracted.type === 'asin') {
    // Link limpo com ASIN + tag
    return { url: `https://www.amazon.com.br/dp/${extracted.id}?tag=${tag}` };
  }

  if (extracted.type === 'short') {
    // Para short links, adiciona tag como parâmetro (funciona na maioria dos casos)
    const separator = originalUrl.includes('?') ? '&' : '?';
    return {
      url: `${originalUrl}${separator}tag=${tag}`,
      note: 'Short link - recomenda-se usar o link completo com ASIN para garantir tracking',
    };
  }

  // Fallback: adiciona tag ao link original
  const separator = originalUrl.includes('?') ? '&' : '?';
  return { url: `${originalUrl}${separator}tag=${tag}` };
}

/**
 * Reconstrói link Shopee com afiliado
 * Shopee usa sistema de redirecionamento, não tag na URL.
 * O afiliado precisa gerar o link na plataforma Shopee Afiliados.
 */
function buildShopeeLink(extracted, originalUrl) {
  const affiliateId = AFFILIATE_TAGS.shopee;

  if (!affiliateId) {
    return {
      url: originalUrl,
      warning: 'ID Shopee Afiliados não configurado.',
      note: 'Shopee usa links de redirecionamento. Gere o link em: https://affiliate.shopee.com.br. O link original foi mantido.',
    };
  }

  // Shopee afiliados usa formato de redirect
  // https://shope.ee/XXXXXX (gerado pela plataforma)
  // Não é possível construir programaticamente sem a API de afiliados
  return {
    url: originalUrl,
    note: 'Shopee requer geração de link via plataforma de afiliados. Use o painel em affiliate.shopee.com.br para gerar seu link personalizado.',
  };
}

/**
 * Reconstrói link Mercado Livre com afiliado
 * ML também usa sistema de redirecionamento via plataforma de afiliados.
 */
function buildMercadoLivreLink(extracted, originalUrl) {
  const affiliateId = AFFILIATE_TAGS.mercadolivre;

  if (!affiliateId) {
    return {
      url: originalUrl,
      warning: 'ID ML Afiliados não configurado.',
      note: 'Mercado Livre usa links de redirecionamento. Gere em: https://www.mercadolivre.com.br/afiliados. O link original foi mantido.',
    };
  }

  return {
    url: originalUrl,
    note: 'Mercado Livre requer geração de link via plataforma de afiliados.',
  };
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

/**
 * Converte um link de produto para link de afiliado
 * @param {string} url - URL original do produto
 * @returns {{ url: string, platform: string, platformName: string, productId: object|null, warning?: string, note?: string }}
 */
function convertLink(url) {
  // Limpa espaços e quebras de linha
  const cleanUrl = url.trim().replace(/\s+/g, '');

  // Detecta plataforma
  const platformInfo = detectPlatform(cleanUrl);
  if (!platformInfo) {
    return {
      url: cleanUrl,
      platform: 'desconhecida',
      platformName: 'Desconhecida',
      productId: null,
      warning: 'Plataforma não reconhecida. Plataformas suportadas: Amazon, Shopee, Mercado Livre.',
    };
  }

  let extracted = null;
  let result = null;

  switch (platformInfo.platform) {
    case 'amazon':
      extracted = extractAmazonId(cleanUrl);
      result = buildAmazonLink(extracted || {}, cleanUrl);
      break;

    case 'shopee':
      extracted = extractShopeeId(cleanUrl);
      result = buildShopeeLink(extracted || {}, cleanUrl);
      break;

    case 'mercadolivre':
      extracted = extractMercadoLivreId(cleanUrl);
      result = buildMercadoLivreLink(extracted || {}, cleanUrl);
      break;
  }

  return {
    url: result.url,
    platform: platformInfo.platform,
    platformName: platformInfo.name,
    productId: extracted,
    originalUrl: cleanUrl,
    ...(result.warning && { warning: result.warning }),
    ...(result.note && { note: result.note }),
  };
}

// ============================================================
// EXPORTAÇÃO + CLI
// ============================================================

module.exports = { convertLink, detectPlatform, AFFILIATE_TAGS };

// Execução direta via CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('');
    console.log('  Link Converter - Conversor de Links de Afiliado');
    console.log('  ================================================');
    console.log('');
    console.log('  Uso:');
    console.log('    node scripts/link-converter.js <URL_DO_PRODUTO>');
    console.log('');
    console.log('  Exemplos:');
    console.log('    node scripts/link-converter.js "https://www.amazon.com.br/dp/B09ZZ4JL5B"');
    console.log('    node scripts/link-converter.js "https://s.shopee.com.br/abc123"');
    console.log('    node scripts/link-converter.js "https://produto.mercadolivre.com.br/MLB-12345"');
    console.log('');
    console.log('  Configuracao:');
    console.log('    Edite AFFILIATE_TAGS no inicio de scripts/link-converter.js');
    console.log('');
    process.exit(0);
  }

  const url = args[0];
  const result = convertLink(url);

  console.log('');
  console.log('  Resultado da Conversao');
  console.log('  ======================');
  console.log(`  Plataforma:  ${result.platformName}`);
  console.log(`  Link original: ${result.originalUrl || url}`);
  console.log(`  Link afiliado: ${result.url}`);
  if (result.productId) {
    console.log(`  ID do produto: ${JSON.stringify(result.productId)}`);
  }
  if (result.warning) {
    console.log(`  ⚠️  ${result.warning}`);
  }
  if (result.note) {
    console.log(`  ℹ️  ${result.note}`);
  }
  console.log('');
}
