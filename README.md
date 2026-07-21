# Meus Links - Página de Ofertas (Estilo Linktree)

Página estática, rápida e responsiva para divulgar links de produtos de e-commerce (Shopee, Mercado Livre, Amazon).

**Zero JavaScript. Zero dependências. 100% HTML + CSS.**

---

## Como Usar

1. Clone ou faça fork deste repositório
2. Edite o `index.html` com seus links e informações
3. Publique no GitHub Pages (gratuito)

---

## Personalizar

### Trocar nome e descrição

No `index.html`, edite o `<header>`:

```html
<h1 class="brand-name">Seu Nome Aqui</h1>
<p class="brand-description">Sua descrição aqui</p>
```

### Trocar avatar

Substitua o arquivo `assets/avatar.svg` por sua imagem (PNG, JPG ou SVG). Recomendado: imagem quadrada de pelo menos 192x192px.

Se usar outro formato, atualize o `src` no HTML:

```html
<img src="assets/sua-foto.png" alt="Avatar" class="avatar" width="96" height="96">
```

### Alterar cores

Edite as variáveis CSS no início do `style.css`:

```css
:root {
  --color-primary: #6c5ce7;     /* Cor principal (borda do avatar, links do footer) */
  --color-background: #f8f9fa;  /* Fundo da página */
  --color-text: #2d3436;        /* Cor do texto */
  --color-card: #ffffff;        /* Fundo dos botões */
  --color-shopee: #ee4d2d;      /* Cor da Shopee */
  --color-mercado-livre: #fff159; /* Cor do Mercado Livre */
  --color-amazon: #ff9900;      /* Cor da Amazon */
}
```

---

## Adicionar / Remover Links

Abra `index.html` e localize a seção marcada com:

```html
<!-- ========== SEUS LINKS AQUI ========== -->
```

Para adicionar um novo link, copie o bloco abaixo e cole dentro da `<section class="links">`:

```html
<a href="URL_DO_PRODUTO" target="_blank" rel="noopener noreferrer" class="link-btn shopee">
  <span class="link-icon">
    <!-- Cole o SVG da loja aqui -->
  </span>
  <span class="link-text">Nome do Produto</span>
</a>
```

**Substitua:**
- `URL_DO_PRODUTO` → link do produto
- `shopee` → classe da loja (`shopee`, `mercado-livre` ou `amazon`)
- `Nome do Produto` → descrição do produto/oferta

Para remover, basta deletar o bloco `<a>...</a>` correspondente.

---

## Lojas Suportadas

| Loja | Classe CSS | Cor |
|------|-----------|-----|
| Shopee | `shopee` | Laranja (#ee4d2d) |
| Mercado Livre | `mercado-livre` | Amarelo (#fff159) |
| Amazon | `amazon` | Laranja escuro (#ff9900) |

---

## Adicionar Nova Loja

1. No `style.css`, adicione uma nova variável e classe:

```css
:root {
  --color-nova-loja: #cor-da-loja;
}

.link-btn.nova-loja {
  border-left-color: var(--color-nova-loja);
}

.link-btn.nova-loja .link-icon {
  color: var(--color-nova-loja);
}
```

2. No `index.html`, use a nova classe no link:

```html
<a href="..." class="link-btn nova-loja">
```

3. Substitua o SVG no `<span class="link-icon">` pelo ícone da loja.

---

## Publicar no GitHub Pages

### Passo a passo

1. **Crie um repositório** no GitHub (ex: `meus-links`)

2. **Faça push** do código:
   ```bash
   git init
   git add .
   git commit -m "Página de links inicial"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/meus-links.git
   git push -u origin main
   ```

3. **Ative o GitHub Pages:**
   - Vá em **Settings** → **Pages**
   - Em "Source", selecione **Deploy from a branch**
   - Selecione o branch `main` e pasta `/ (root)`
   - Clique em **Save**

4. **Acesse** em: `https://SEU_USUARIO.github.io/meus-links`

---

## Domínio Customizado (Opcional)

Para usar um domínio próprio (ex: `links.seusite.com`):

1. Crie um arquivo `CNAME` na raiz do projeto com o domínio:
   ```
   links.seusite.com
   ```

2. No seu provedor de DNS, adicione um registro CNAME apontando para `SEU_USUARIO.github.io`

3. Nas configurações do GitHub Pages, adicione o domínio customizado

---

## Estrutura do Projeto

```
meus-links/
├── index.html        ← Página principal (edite seus links aqui)
├── style.css         ← Estilos (edite cores e visual aqui)
├── assets/
│   └── avatar.svg    ← Sua foto/logo (substitua)
├── .gitignore        ← Arquivos ignorados pelo git
├── CNAME             ← (opcional) Domínio customizado
└── README.md         ← Este arquivo
```

---

## Requisitos Técnicos

- Sem JavaScript
- Sem frameworks ou bibliotecas
- Única dependência externa: Google Fonts (Inter) — pode ser removida
- Tamanho total < 100KB
- Mobile-first e responsivo
- Acessível (suporte a prefers-reduced-motion, foco visível)

---

## Licença

Livre para uso pessoal e comercial. Faça o que quiser com o código.
