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

1. No Kiro, selecione o agente **"Achadin Afiliados"** no seletor de agentes
2. Envie comandos pelo chat:

#### Cadastro simples:
```
https://s.shopee.com.br/abc123 - Fone Bluetooth QCY - R$ 45,90 - Tecnologia
```

#### Gerar conteúdo para um produto existente:
```
Gera conteúdo pro produto #001 Cera Vonixx
```

#### Fluxo completo (cadastro + copy + imagem):
```
https://amzn.to/xyz789 - Echo Dot 5 - R$ 299 - Tecnologia - faz tudo
```

#### Apenas imagem:
```
Gera uma imagem pro #005 Kindle no formato carrossel
```

### O que o agente faz automaticamente:

| Ação | Descrição |
|------|-----------|
| Detecta plataforma | Identifica Shopee/ML/Amazon pelo domínio do link |
| Atribui código | Descobre o próximo código sequencial (#008, #009...) |
| Cadastra no Notion | Cria item na Tabela de Produtos com status "Publicado" |
| Gera copy | Texto otimizado para Reels, Story e Post com CTA e hashtags |
| Gera imagem | Imagem promocional via Gemini AI (9:16 para Story, 1:1 para Post) |
| Salva no Notion | Armazena copy + link da imagem na database "Conteúdo Instagram" |

---

## Databases no Notion

O projeto usa 3 databases:

### 1. Tabela de Produtos
Catálogo principal — alimenta o site.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome do Produto | title | Nome exibido no site |
| Código | rich_text | #001, #002... (ordena os links) |
| Plataforma | select | Shopee / Mercado Livre / Amazon |
| Link de Afiliado | url | Link real do produto |
| Preço | number (R$) | Preço do produto |
| Categoria | select | Automotivo / Casa & Organização / Tecnologia |
| Status | select | Publicado / Aguardando Vídeo / Pronto para Postar |

### 2. Conteúdo Instagram
Conteúdo gerado pelo agente — copy, imagens e controle de publicação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | title | "Post #008 - Fone QCY" |
| Tipo | select | Reels / Story / Carrossel / Post |
| Status | select | Rascunho / Aprovado / Publicado |
| Plataforma | select | Shopee / Mercado Livre / Amazon |
| Codigo Produto | rich_text | Referência ao produto (#XXX) |
| Copy | rich_text | Texto da divulgação |
| Palavra-Chave Direct | rich_text | Palavra para o seguidor mandar no DM |
| Link do Produto | url | Link de afiliado |
| URL da Imagem | url | Link público da imagem gerada |
| Data de Publicacao | date | Quando postar |

### 3. Calendário de Conteúdo
Pipeline de produção de vídeos (fluxo manual).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | title | "Reels #001 - Cera Vonixx" |
| Status | status | Ideia → Baixando Vídeos → Editando CapCut → Gerando Voz IA → Agendado/Postado |
| Link do Produto | url | Link de afiliado |
| Palavra-Chave Direct | rich_text | Palavra para DM |
| Data de Publicação | date | Quando postar |

---

## Gerenciar Produtos (via Notion)

Toda gestão é feita pela **Tabela de Produtos** no Notion:

| Ação | Como fazer |
|------|-----------|
| Adicionar produto | Use o agente OU crie uma linha com Código, Nome, Plataforma, Link e Status = "Publicado" |
| Remover da página | Mude o Status para qualquer opção diferente de "Publicado" |
| Alterar plataforma | Mude o campo "Plataforma" (Shopee, Mercado Livre, Amazon) |
| Mudar ordem | Altere o campo "Código" (#001, #002...) — ordena ascendente |
| Deletar permanente | Delete a linha da tabela |

Após editar, [dispare o build manualmente](https://github.com/achadinnbr/achadinnbr.github.io/actions/workflows/build.yml) ou aguarde o cron (a cada 1h).

---

## Geração de Imagens (Gemini AI)

O agente gera imagens promocionais usando a API do Google Gemini via MCP server.

### Configuração do MCP Server

O MCP server `media-pipeline` precisa estar configurado no Kiro. Adicione ao arquivo `~/.kiro/settings/mcp.json`:

```json
"media-pipeline": {
  "command": "node",
  "args": [
    "c:/projects/sandbox/claude-image-gen/mcp-server/build/bundle.js"
  ],
  "env": {
    "GEMINI_API_KEY": "<SUA_API_KEY>",
    "GEMINI_DEFAULT_MODEL": "gemini-2.0-flash-preview-image-generation",
    "IMAGE_PROVIDER": "gemini",
    "IMAGE_OUTPUT_DIR": "c:/projects/sandbox/meus-links/generated-images"
  },
  "disabled": false
}
```

### Como obter a API Key do Gemini

1. Acesse [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave e coloque no `mcp.json`

### Onde ficam as imagens

- **Local**: `generated-images/` na raiz do projeto
- **Público**: `https://achadinnbr.github.io/generated-images/[nome-arquivo]`
- As imagens são commitadas no repositório e servidas pelo GitHub Pages

---

## Automação (Notion → GitHub Pages)

### Secrets configurados no GitHub

Em **Settings → Secrets and variables → Actions**:

| Secret | Descrição |
|--------|-----------|
| `NOTION_API_TOKEN` | Token da integração Notion |
| `NOTION_DATABASE_ID` | ID da database "Tabela de Produtos" |

### Disparar o build

- **Automático:** roda a cada 1 hora via cron
- **Manual:** vá em **Actions → Build from Notion → Run workflow**

---

## Rodar Localmente

### Pré-requisitos

- Node.js 20+
- npm

### Instalar dependências

```bash
npm install
```

### Gerar a página a partir do Notion

```bash
# Linux / Mac
NOTION_API_TOKEN=seu_token NOTION_DATABASE_ID=seu_db_id npm run build
```

```powershell
# PowerShell (Windows)
$env:NOTION_API_TOKEN="seu_token"; $env:NOTION_DATABASE_ID="seu_db_id"; npm run build
```

### Visualizar no navegador

Abra o `index.html` direto no navegador, use Live Server no VS Code, ou:

```bash
python -m http.server 8080
```

---

## Personalizar Visual

### Alterar cores

Edite as variáveis CSS no início do `style.css`:

```css
:root {
  --color-primary: #a78bfa;       /* Cor principal */
  --color-background: #1a1a2e;    /* Fundo da página */
  --color-card: #16213e;          /* Fundo dos botões */
  --color-shopee: #ee4d2d;        /* Cor da Shopee */
  --color-mercado-livre: #fff159; /* Cor do Mercado Livre */
  --color-amazon: #ff9900;        /* Cor da Amazon */
}
```

### Trocar avatar

Substitua o arquivo `assets/logo.jpeg` por sua imagem (quadrada, mínimo 192x192px).

### Adicionar nova loja

1. Adicione o logo em `assets/logos/novaloja.webp`
2. No `style.css`, crie a classe:
   ```css
   .link-btn.nova-loja { border-left-color: #cor; }
   .link-btn.nova-loja .link-icon { background-color: var(--color-background); }
   ```
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
│   └── build.js            ← Script que gera index.html a partir do Notion
├── assets/
│   ├── logo.jpeg           ← Avatar do perfil
│   └── logos/              ← Logos das lojas
│       ├── amazon.webp
│       ├── instagram.webp
│       ├── mercadolivre.webp
│       └── shopee.webp
├── generated-images/       ← Imagens geradas pelo agente (Gemini AI)
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

## Fluxo Completo de Trabalho

```
┌─────────────────────────────────────────────────────────────────┐
│  VOCÊ                                                           │
│  Cola link + nome + preço no chat do agente                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENTE ACHADIN                                                 │
│  1. Detecta plataforma                                          │
│  2. Gera código (#XXX)                                          │
│  3. Cadastra na Tabela de Produtos (Notion)                     │
│  4. Gera copy para Instagram                                    │
│  5. Gera imagem promocional (Gemini AI)                         │
│  6. Salva tudo na database "Conteúdo Instagram" (Notion)        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  VOCÊ                                                           │
│  Revisa no Notion → Aprova → Posta no Instagram                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS (automático a cada 1h)                          │
│  Build → Gera index.html → Deploy no GitHub Pages               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Lojas Suportadas

| Loja | Classe CSS | Logo |
|------|-----------|------|
| Shopee | `shopee` | `assets/logos/shopee.webp` |
| Mercado Livre | `mercado-livre` | `assets/logos/mercadolivre.webp` |
| Amazon | `amazon` | `assets/logos/amazon.webp` |

---

## Stack Técnica

- HTML5 + CSS3 (página final sem JS obrigatório, apenas busca client-side)
- Node.js + @notionhq/client (build)
- GitHub Actions (CI/CD)
- GitHub Pages (hospedagem gratuita)
- Notion (backoffice / gestão de produtos + conteúdo)
- Google Gemini AI (geração de imagens via media-pipeline MCP)
- Kiro IDE + Agente customizado (automação de cadastro e conteúdo)
- Google Fonts (Inter)

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
