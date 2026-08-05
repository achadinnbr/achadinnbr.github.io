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

## Gerenciar Produtos (via Notion)

Toda gestão é feita pela **Tabela de Produtos** no Notion:

| Ação | Como fazer |
|------|-----------|
| Adicionar produto | Crie uma linha nova com Código, Nome, Plataforma, Link e Status = "Publicado" |
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
│       ├── mercadolivre.webp
│       └── shopee.webp
├── .github/
│   └── workflows/
│       └── build.yml       ← GitHub Action (cron + manual)
├── .gitignore
└── README.md               ← Este arquivo
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
- Notion (backoffice / gestão de produtos)
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
