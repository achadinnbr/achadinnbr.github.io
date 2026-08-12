# Achadin BR - Página de Links de Afiliados

Página estática e responsiva para divulgar links de produtos (Shopee, Mercado Livre, Amazon), gerada automaticamente a partir do Notion.

**Edite pelo celular no Notion → a página atualiza sozinha via GitHub Actions.**

---

## Como Funciona

1. Você cadastra/edita produtos na **Tabela de Produtos** no Notion (funciona pelo app do celular)
2. O GitHub Actions roda o script de build (a cada 1h ou manualmente)
3. O script consulta a API do Notion, filtra produtos com status "Publicado" e gera o `index.html`
4. O GitHub Pages serve a página atualizada

---

## Agente IA - Achadin Afiliados

O projeto inclui um **agente Kiro customizado** que automatiza o cadastro de produtos e a geração de conteúdo para Instagram.

### Como usar

1. No Kiro, selecione o agente **"Achadin Afiliados"** no seletor de agentes (dropdown ao lado de "Default")
2. Envie comandos pelo chat

### Comandos disponíveis

#### 1. Cadastro simples
```
https://s.shopee.com.br/abc123 - Fone Bluetooth QCY - R$ 45,90 - Tecnologia
```
O agente cadastra o produto no Notion com o próximo código sequencial.

#### 2. Fluxo completo (cadastro + copy + prompt de imagem)
```
https://amzn.to/xyz789 - Echo Dot 5 - R$ 299 - Tecnologia - faz tudo
```
Cadastra o produto E gera todo o material de divulgação.

#### 3. Gerar conteúdo para produto existente
```
Gera conteúdo pro produto #001 Cera Vonixx
```
Gera copy + prompt de imagem para um produto já cadastrado.

#### 4. Com imagens do produto (recomendado!)
Anexe fotos do produto no chat + escreva:
```
[fotos anexadas] Gera conteúdo pro #008 Kit Cera Blend
```
O agente gera um prompt de imagem que referencia as fotos para usar no Gemini web.

#### 5. Apenas prompt de imagem
```
[foto anexada] Gera um prompt pra story desse produto
```

### O que o agente faz automaticamente

| Ação                    | Descrição                                                      |
|-------------------------|----------------------------------------------------------------|
| Detecta plataforma      | Identifica Shopee/ML/Amazon pelo domínio do link               |
| Atribui código          | Descobre o próximo código sequencial (#008, #009...)            |
| Verifica duplicatas     | Checa se produto já existe antes de cadastrar                  |
| Cadastra no Notion      | Cria item na Tabela de Produtos com status "Publicado"         |
| Gera 3 variações de copy| Oferta, Solução e Tendência com CTAs diferenciados             |
| Aplica compliance       | Inclui #publi em toda copy (obrigatório)                       |
| Hook de curiosidade     | Nunca revela nome/marca na primeira linha                      |
| Prova social            | Usa nota/avaliações quando disponíveis                         |
| Gera prompt de imagem   | Com identidade visual Achadin BR (dark + laranja/amarelo)      |
| Salva no Notion         | Armazena copy + prompt na database "Conteúdo Instagram"        |
| Alerta preço expirado   | Avisa quando preço tem mais de 7 dias                          |
| Sugere cadência         | Recomenda gerar mais conteúdo quando rascunhos estão baixos    |

---

## Fluxo de Geração de Imagem

O agente **não gera a imagem diretamente** (limitação de quota da API). Ao invés disso, ele gera um **prompt otimizado** para você usar no Gemini web (gemini.google.com) com sua assinatura Plus.

### Passo a passo:

1. **No Kiro**: mande o link + fotos do produto para o agente
2. **Agente retorna**: copy + prompt de imagem formatado
3. **No Gemini web** (gemini.google.com): cole o prompt + as mesmas fotos do produto
4. **Resultado**: imagem promocional pronta para postar no Instagram
5. **No Notion**: o prompt fica salvo no campo "Prompt Imagem" para referência futura

### Dica: O prompt já vem personalizado com:
- Nome e preço do produto
- Estilo visual com identidade Achadin BR (dark + laranja/amarelo/azul royal)
- Adaptação sutil por categoria (automotivo = metálico, tech = neon, casa = clean)
- Texto para sobrepor na imagem (hook + CTA)
- Formato correto (9:16 para Story/Reels, 1:1 para Feed)
- Safe zone de 10% nas bordas (evita corte no feed)

---

## Gerador de Posts para WhatsApp

Ferramenta CLI para gerar posts prontos para colar no seu canal/grupo do WhatsApp. O fluxo é simples: você copia um link de outro canal de ofertas, roda o script, e ele te devolve a copy formatada com o seu link de afiliado.

### Como usar (comando rápido)

```powershell
node scripts/gerar-post-whatsapp.js "<URL>" --nome "Produto" --preco 99.90
```

### Exemplos práticos

```powershell
# Amazon - link copiado de outro canal
node scripts/gerar-post-whatsapp.js "https://www.amazon.com.br/dp/B09ZZ4JL5B" --nome "Echo Dot 5" --preco 299

# Shopee - link curto
node scripts/gerar-post-whatsapp.js "https://s.shopee.com.br/9pRXfH5fAe" --nome "Fone QCY T13" --preco 45.90 --categoria Tecnologia

# Mercado Livre - com template específico
node scripts/gerar-post-whatsapp.js "https://produto.mercadolivre.com.br/MLB-12345" --nome "Cera Vonixx" --preco 32 --template urgencia
```

### Parâmetros

| Parâmetro    | Obrigatório | Descrição                                                          |
|--------------|:-----------:|--------------------------------------------------------------------|
| `<URL>`      |     Sim     | Link do produto (primeiro argumento)                               |
| `--nome`     |     Sim     | Nome do produto                                                    |
| `--preco`    |     Não     | Preço em reais (ex: 45.90)                                         |
| `--categoria`|     Não     | Tecnologia, Casa & Organização, Automotivo, Beleza, Moda, Esportes |
| `--template` |     Não     | oferta, urgencia, recomendacao, preco, todos (padrão: todos)       |

### Templates disponíveis

| Template       | Estilo             | Quando usar                           |
|----------------|--------------------|---------------------------------------|
| `oferta`       | Direto e objetivo  | Ofertas do dia-a-dia                  |
| `urgencia`     | Escassez/FOMO      | Promoções relâmpago, estoque limitado |
| `recomendacao` | Tom pessoal        | Produtos que você realmente testou    |
| `preco`        | Destaca o valor    | Quando o preço é o grande diferencial |

### Configurar suas tags de afiliado

Edite o arquivo `scripts/link-converter.js` e preencha suas tags:

```javascript
const AFFILIATE_TAGS = {
  amazon: 'SUA-TAG-AQUI-20',   // Tag do Amazon Associates
  shopee: '',                    // ID Shopee Afiliados (ver nota abaixo)
  mercadolivre: '',              // ID ML Afiliados (ver nota abaixo)
};
```

> **Nota sobre Shopee e Mercado Livre:** Essas plataformas usam links de redirecionamento gerados pelo painel de afiliados — não é possível construir o link só com uma "tag" na URL como a Amazon. O script detecta a plataforma e gera a copy, mas você precisa gerar o link de afiliado direto no painel ([Shopee Afiliados](https://affiliate.shopee.com.br) / [ML Afiliados](https://www.mercadolivre.com.br/afiliados)) e colar como URL.

### Fluxo de uso no dia-a-dia

```
1. Você vê uma oferta boa em outro canal do WhatsApp
2. Copia o link do produto
3. Roda: node scripts/gerar-post-whatsapp.js "LINK" --nome "PRODUTO" --preco XX
4. O script converte o link (Amazon) ou mantém o original (Shopee/ML)
5. Gera copy formatada com *negrito*, emojis e CTA
6. Você copia a copy e cola no SEU canal
```

### Arquitetura dos scripts

| Arquivo                          | Responsabilidade                                            |
|----------------------------------|-------------------------------------------------------------|
| `scripts/link-converter.js`      | Detecta plataforma, extrai ID do produto, reconstrói com tag|
| `scripts/whatsapp-copy.js`       | Gera copy formatada para WhatsApp (4 templates)             |
| `scripts/gerar-post-whatsapp.js` | Script principal — orquestra os dois acima                  |

Cada script também funciona individualmente:

```powershell
# Só converter link
node scripts/link-converter.js "https://www.amazon.com.br/dp/B09ZZ4JL5B"

# Só gerar copy (quando já tem o link pronto)
node scripts/whatsapp-copy.js --nome "Echo Dot" --preco 299 --link "https://amzn.to/xxx?tag=achadinnbr-20" --plataforma Amazon --template todos
```

> **Guia completo:** Veja o passo a passo de setup, boas práticas e fluxo diário em [`docs/GUIA-WHATSAPP-AFILIADOS.md`](docs/GUIA-WHATSAPP-AFILIADOS.md)

---

## Databases no Notion

O projeto usa 3 databases:

### 1. Tabela de Produtos
Catálogo principal — alimenta o site.

| Campo           | Tipo       | Descrição                                                                                                             |
|-----------------|------------|-----------------------------------------------------------------------------------------------------------------------|
| Nome do Produto | title      | Nome completo (controle interno — site exibe versão genérica)                                                         |
| Código          | rich_text  | #001, #002... (ordena os links)                                                                                   |
| Plataforma      | select     | Shopee / Mercado Livre / Amazon                                                                                       |
| Link de Afiliado| url        | Link real do produto                                                                                                  |
| Preço           | number (R$)| Preço do produto                                                                                                      |
| Categoria       | select     | Automotivo, Bebê, Beleza, Casa & Org., Cozinha, Eletrônicos, Ferramentas, Fitness, Moda, Papelaria, Pet, Tecnologia   |
| Nota            | number     | Nota do produto na plataforma (ex: 4.8)                                                                               |
| Nº Avaliações   | number     | Quantidade de avaliações                                                                                              |
| Status          | select     | Publicado / Aguardando Vídeo / Pronto para Postar                                                                     |

### 2. Conteúdo Instagram
Conteúdo gerado pelo agente — copy, prompt de imagem e controle de publicação.

| Campo                | Tipo      | Descrição                                          |
|----------------------|-----------|----------------------------------------------------|
| Nome                 | title     | "Post #008 - Fone QCY"                             |
| Tipo                 | select    | Reels / Story / Carrossel / Post                   |
| Status               | select    | Rascunho / Aprovado / Publicado                    |
| Plataforma           | select    | Shopee / Mercado Livre / Amazon                    |
| Codigo Produto       | rich_text | Referência ao produto (#XXX)                       |
| Copy                 | rich_text | Texto da divulgação (com #publi obrigatório)       |
| Prompt Imagem        | rich_text | Prompt otimizado com identidade visual Achadin BR  |
| Palavra-Chave Direct | rich_text | "LINK" (fixa — automação responde via DM)          |
| Link do Produto      | url       | Link de afiliado                                   |
| URL da Imagem        | url       | Link da imagem final (após gerar no Gemini)        |
| Performance          | select    | Pendente / Baixa / Média / Alta                    |
| Data de Publicação   | date      | Quando postar                                      |

### 3. Calendário de Conteúdo (legado)
Pipeline de produção de vídeos — uso manual, não recebe novos itens do agente.

---

## Gerenciar Produtos (via Notion)

| Ação                | Como fazer                                                                                      |
|---------------------|-------------------------------------------------------------------------------------------------|
| Adicionar produto   | Use o agente OU crie uma linha com Código, Nome, Plataforma, Link e Status = "Publicado"        |
| Remover da página   | Mude o Status para qualquer opção diferente de "Publicado"                                      |
| Alterar plataforma  | Mude o campo "Plataforma" (Shopee, Mercado Livre, Amazon)                                       |
| Mudar ordem         | Altere o campo "Código" (#001, #002...) — ordena ascendente                                     |
| Deletar permanente  | Delete a linha da tabela                                                                        |

Após editar, [dispare o build manualmente](https://github.com/achadinnbr/achadinnbr.github.io/actions/workflows/build.yml) ou aguarde o cron (a cada 1h).

---

## Automação (Notion → GitHub Pages)

### Secrets configurados no GitHub

Em **Settings → Secrets and variables → Actions**:

| Secret             | Descrição                              |
|--------------------|----------------------------------------|
| `NOTION_API_TOKEN` | Token da integração Notion             |
| `NOTION_DATABASE_ID` | ID da database "Tabela de Produtos"  |

### Disparar o build

- **Automático:** roda a cada 1 hora via cron
- **Manual:** vá em **Actions → Build from Notion → Run workflow**

---

## Rodar Localmente

### Pré-requisitos

- Node.js 20+
- npm
- Kiro IDE (para usar o agente)

### Instalar dependências

```bash
npm install
```

### Gerar a página a partir do Notion

```powershell
# PowerShell (Windows)
$env:NOTION_API_TOKEN="seu_token"; $env:NOTION_DATABASE_ID="seu_db_id"; npm run build
```

```bash
# Linux / Mac
NOTION_API_TOKEN=seu_token NOTION_DATABASE_ID=seu_db_id npm run build
```

### Visualizar no navegador

Abra o `index.html` direto no navegador ou use Live Server no VS Code.

---

## Fluxo Completo de Trabalho

```
┌─────────────────────────────────────────────────────────────────┐
│  VOCÊ                                                           │
│  Cola link + nome + preço + fotos no chat do agente             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENTE ACHADIN (Kiro)                                          │
│  1. Detecta plataforma pelo link                                │
│  2. Gera código sequencial (#XXX)                               │
│  3. Cadastra na Tabela de Produtos → site atualiza em 1h        │
│  4. Gera copy (Reels + Post) com CTA e hashtags                 │
│  5. Gera prompt otimizado para imagem                           │
│  6. Salva tudo na database "Conteúdo Instagram"                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  GERADOR WHATSAPP (CLI)                                         │
│  1. Copia link de outro canal de ofertas                        │
│  2. Roda: node scripts/gerar-post-whatsapp.js "URL" --nome ...  │
│  3. Script converte link + gera copy formatada                  │
│  4. Cola no seu canal WhatsApp                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  VOCÊ NO GEMINI WEB (gemini.google.com)                         │
│  1. Cola o prompt gerado pelo agente                            │
│  2. Anexa as mesmas fotos do produto                            │
│  3. Gera a imagem promocional                                   │
│  4. Baixa e posta no Instagram                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  NOTION                                                         │
│  Mude status de "Rascunho" → "Publicado" após postar            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS (automático a cada 1h)                          │
│  Build → Gera index.html → Deploy no GitHub Pages               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Personalizar Visual

### Alterar cores

Edite as variáveis CSS no início do `style.css`:

```css
:root {
  --color-primary: #a78bfa;
  --color-background: #1a1a2e;
  --color-card: #16213e;
  --color-shopee: #ee4d2d;
  --color-mercado-livre: #fff159;
  --color-amazon: #ff9900;
}
```

### Trocar avatar

Substitua o arquivo `assets/logo.jpeg` por sua imagem (quadrada, mínimo 192x192px).

### Adicionar nova loja

1. Adicione o logo em `assets/logos/novaloja.webp`
2. No `style.css`, crie a classe `.link-btn.nova-loja`
3. No `scripts/build.js`, adicione a plataforma no `PLATFORM_MAP`
4. No Notion, adicione a opção na propriedade "Plataforma"

---

## Estrutura do Projeto

```
meus-links/
├── index.html              ← Gerado automaticamente (não editar manualmente)
├── style.css               ← Estilos visuais
├── package.json            ← Dependências do build
├── scripts/
│   ├── build.js            ← Script que gera index.html a partir do Notion
│   ├── link-converter.js   ← Conversor de links de afiliado (Amazon/Shopee/ML)
│   ├── whatsapp-copy.js    ← Gerador de copy formatada para WhatsApp
│   └── gerar-post-whatsapp.js  ← CLI unificado (conversor + copy)
├── docs/
│   └── GUIA-WHATSAPP-AFILIADOS.md  ← Guia completo de setup e operação
├── assets/
│   ├── logo.jpeg           ← Avatar do perfil
│   └── logos/              ← Logos das lojas
├── generated-images/       ← Imagens geradas (quando via API)
├── .kiro/
│   └── agents/
│       └── achadin-afiliados.md  ← Agente IA customizado
├── .github/
│   └── workflows/
│       └── build.yml       ← GitHub Action (cron + manual)
├── .gitignore
└── README.md               ← Este arquivo
```

---

## Stack Técnica

- HTML5 + CSS3 (página final, apenas busca client-side)
- Node.js + @notionhq/client (build)
- GitHub Actions (CI/CD)
- GitHub Pages (hospedagem gratuita)
- Notion (backoffice: produtos + conteúdo Instagram)
- Google Gemini web (geração de imagens via prompt)
- Kiro IDE + Agente customizado (automação)
- InfluenciaMax (automação de DM por comentário no Instagram)
- Google Fonts (Inter)

---

## Estratégia Anti-Bypass

O site exibe **descrições genéricas** dos produtos (sem marca/modelo exato) para evitar que o cliente copie o nome e busque diretamente na loja, bypassando o link de afiliado.

- O `build.js` converte automaticamente o nome completo em descrição curta + categoria
- Formato no site: `#XXX - Descrição genérica (Categoria)`
- O nome completo no Notion serve apenas para controle interno

### Jornada de conversão blindada:

```
Instagram (hook de curiosidade, sem nome)
  → Comentário "LINK" (automação InfluenciaMax)
    → DM com link para o site (achadinnbr.github.io)
      → Site mostra só código + descrição genérica
        → Clique no botão → Link de afiliado ativo
```

---

## Publicar no GitHub Pages

1. Crie o repositório `SEU_USUARIO.github.io` no GitHub
2. Faça push do código
3. Em **Settings → Pages**, selecione branch `main`, pasta `/ (root)`
4. Configure os secrets (NOTION_API_TOKEN e NOTION_DATABASE_ID)
5. Acesse em `https://SEU_USUARIO.github.io`

---

## Licença

Livre para uso pessoal e comercial.
