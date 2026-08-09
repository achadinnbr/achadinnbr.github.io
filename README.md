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

| Ação | Descrição |
|------|-----------|
| Detecta plataforma | Identifica Shopee/ML/Amazon pelo domínio do link |
| Atribui código | Descobre o próximo código sequencial (#008, #009...) |
| Cadastra no Notion | Cria item na Tabela de Produtos com status "Publicado" |
| Gera copy | Texto otimizado para Reels, Story e Post com CTA e hashtags |
| Gera prompt de imagem | Prompt pronto pra colar no Gemini web com suas fotos |
| Salva no Notion | Armazena copy + prompt na database "Conteúdo Instagram" |

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
- Estilo visual adequado à categoria (automotivo, tech, casa)
- Cores da plataforma (Shopee laranja, ML amarelo, Amazon laranja/preto)
- Texto para sobrepor na imagem (hook + CTA)
- Formato correto (9:16 para Story, 1:1 para Post)

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

### 2. Conteúdo Instagram (NOVO)
Conteúdo gerado pelo agente — copy, prompt de imagem e controle de publicação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | title | "Post #008 - Fone QCY" |
| Tipo | select | Reels / Story / Carrossel / Post |
| Status | select | Rascunho / Aprovado / Publicado |
| Plataforma | select | Shopee / Mercado Livre / Amazon |
| Codigo Produto | rich_text | Referência ao produto (#XXX) |
| Copy | rich_text | Texto da divulgação |
| Prompt Imagem | rich_text | Prompt otimizado para gerar imagem no Gemini web |
| Palavra-Chave Direct | rich_text | Palavra para o seguidor mandar no DM |
| Link do Produto | url | Link de afiliado |
| URL da Imagem | url | Link da imagem final (após gerar no Gemini) |
| Data de Publicação | date | Quando postar |

### 3. Calendário de Conteúdo (legado)
Pipeline de produção de vídeos — uso manual, não recebe novos itens do agente.

---

## Gerenciar Produtos (via Notion)

| Ação | Como fazer |
|------|-----------|
| Adicionar produto | Use o agente OU crie uma linha com Código, Nome, Plataforma, Link e Status = "Publicado" |
| Remover da página | Mude o Status para qualquer opção diferente de "Publicado" |
| Alterar plataforma | Mude o campo "Plataforma" (Shopee, Mercado Livre, Amazon) |
| Mudar ordem | Altere o campo "Código" (#001, #002...) — ordena ascendente |
| Deletar permanente | Delete a linha da tabela |

Após editar, [dispare o build manualmente](https://github.com/achadinnbr/achadinnbr.github.io/actions/workflows/build.yml) ou aguarde o cron (a cada 1h).

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
│   └── build.js            ← Script que gera index.html a partir do Notion
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
