# Guia Completo: Canal WhatsApp para Afiliados - Achadin BR

Guia passo a passo para criar, configurar e operar seu canal de ofertas no WhatsApp usando as ferramentas que construímos.

---

## Índice

1. [Preciso de WhatsApp Business?](#1-preciso-de-whatsapp-business)
2. [Criar o Canal no WhatsApp](#2-criar-o-canal-no-whatsapp)
3. [Configurar o Perfil do Canal](#3-configurar-o-perfil-do-canal)
4. [Configurar suas Tags de Afiliado](#4-configurar-suas-tags-de-afiliado)
5. [Fluxo Diário de Publicação](#5-fluxo-diário-de-publicação)
6. [Boas Práticas para Crescer](#6-boas-práticas-para-crescer)
7. [Erros Comuns (evite isso)](#7-erros-comuns-evite-isso)
8. [Próximos Passos (automação futura)](#8-próximos-passos-automação-futura)

---

## 1. Preciso de WhatsApp Business?

**Resposta curta: NÃO é obrigatório, mas é recomendado.**

|                       | WhatsApp Normal |        WhatsApp Business       |
|-----------------------|-----------------|--------------------------------|
| Criar canal           |       Sim       |               Sim              |
| Postar ofertas        |       Sim       |               Sim              |
| Perfil profissional   |       Não       | Sim (endereço, site, catálogo) |
| Respostas automáticas |       Não       |               Sim              |
| Etiquetas de contatos |       Não       |               Sim              |
| Métricas do canal     |     Básicas     |         Básicas (iguais)       |
| Custo                 |      Grátis     |              Grátis            |

**Recomendação:** Use o **WhatsApp Business** (app gratuito). Vantagens:

- Perfil com link para seu Instagram (@achadinn_br) e site (GitHub Pages)
- Mensagem de boas-vindas automática
- Separação do número pessoal (se quiser usar outro chip)
- Passa mais credibilidade

**Download:** [WhatsApp Business (Android)](https://play.google.com/store/apps/details?id=com.whatsapp.w4b) | [WhatsApp Business (iOS)](https://apps.apple.com/app/whatsapp-business/id1386412985)

> Nota: Você NÃO precisa da WhatsApp Business API (essa é paga e é para empresas grandes). O app WhatsApp Business gratuito é suficiente.

---

## 2. Criar o Canal no WhatsApp

### Passo a passo:

1. Abra o **WhatsApp** (ou WhatsApp Business)
2. Vá na aba **"Atualizações"** (ou "Status" dependendo da versão)
3. Toque no ícone **"+"** ao lado de "Canais"
4. Selecione **"Criar canal"**
5. Aceite os termos (sua identidade fica protegida — seguidores não veem seu número)
6. Escolha o nome: **"Achadin BR - Ofertas"** (ou similar)
7. Adicione a foto de perfil (use o `assets/logo.jpeg` do projeto)
8. Escreva a descrição:

```
As melhores ofertas de Shopee, Amazon e Mercado Livre selecionadas diariamente.

Siga para não perder nenhuma promoção!

Instagram: @achadinn_br
```

9. Toque em **"Criar canal"**

### Pronto! Seu canal está no ar.

Qualquer pessoa pode encontrá-lo na busca do WhatsApp e seguir.

---

## 3. Configurar o Perfil do Canal

Após criar, vá nas configurações do canal e preencha:

|   Campo   |          O que colocar               |
|-----------|--------------------------------------|
| Nome      | Achadin BR - Ofertas                 |
| Foto      | Logo do projeto (assets/logo.jpeg)   |
| Descrição | Texto acima com Instagram e proposta |
| Categoria | Compras (ou Negócios)                |

### Se estiver usando WhatsApp Business:

Vá em **Configurações → Perfil comercial** e preencha:

| Campo                   | O que colocar                                                                                       |
|-------------------------|-----------------------------------------------------------------------------------------------------|
| Endereço                | Pode deixar vazio                                                                                   |
| Categoria               | Compras e Varejo                                                                                    |
| Site                    | https://SEU_USUARIO.github.io (seu GitHub Pages)                                                    |
| Instagram               | @achadinn_br                                                                                        |
| Horário                 | Sempre disponível                                                                                   |
| Mensagem de ausência    | Desativada                                                                                          |
| Mensagem de boas-vindas | "Bem-vindo! Aqui você encontra as melhores ofertas do dia. Reaja com emoji nas ofertas que gostar!" |

---

## 4. Configurar suas Tags de Afiliado

Antes de começar a postar, configure suas tags no projeto:

### Amazon Associates

1. Acesse [affiliate-program.amazon.com.br](https://affiliate-program.amazon.com.br)
2. Cadastre-se (ou faça login)
3. Sua tag está em **Configurações da conta** (formato: `seusite-20`)
4. Edite `scripts/link-converter.js`:

```javascript
const AFFILIATE_TAGS = {
  amazon: 'SUA-TAG-AQUI-20',  // ← cole sua tag real aqui
  shopee: '',
  mercadolivre: '',
};
```

### Shopee Afiliados

1. Acesse [affiliate.shopee.com.br](https://affiliate.shopee.com.br)
2. Cadastre-se com seu CPF
3. Aguarde aprovação (1-3 dias)
4. Use o painel para gerar links — cole no script como URL direta

### Mercado Livre Afiliados

1. Acesse [mercadolivre.com.br/afiliados](https://www.mercadolivre.com.br/afiliados)
2. Cadastre-se
3. Use a ferramenta de "Gerar links" no painel
4. Cole o link gerado como URL no script

---

## 5. Fluxo Diário de Publicação

Este é o processo que você vai repetir todos os dias:

### Passo 1: Garimpar ofertas

Siga 5-10 canais/grupos de ofertas no WhatsApp. Eles fazem a curadoria por você. Exemplos de onde encontrar:

- Busque "ofertas" na aba de canais do WhatsApp
- Grupos do Telegram de promoções (muitos replicam no WhatsApp)
- Perfis de ofertas no Instagram

### Passo 2: Identificar boas ofertas

Critérios para escolher o que repostar:
- Preço realmente bom (pesquise antes)
- Produto com demanda (todo mundo usa/quer)
- Disponível (não adianta postar esgotado)
- De preferência Amazon (sua tag já funciona automaticamente)

### Passo 3: Gerar seu post

No terminal (PowerShell), rode:

```powershell
# Exemplo Amazon
npm run whatsapp -- "https://www.amazon.com.br/dp/B09ZZ4JL5B" --nome "Echo Dot 5" --preco 299 --categoria Tecnologia

# Exemplo Shopee (cole o link que você gerou no painel de afiliados)
npm run whatsapp -- "https://shope.ee/SEU_LINK_AFILIADO" --nome "Fone QCY T13" --preco 45.90 --categoria Tecnologia
```

### Passo 4: Copiar e colar no canal

1. Escolha o template que mais combina com a oferta
2. Selecione a copy no terminal (ou copie do output)
3. Cole no seu canal do WhatsApp
4. Opcionalmente, adicione uma foto do produto (print do site funciona)

### Passo 5: Repetir

Poste entre **5-10 ofertas por dia**, distribuídas ao longo do dia:
- Manhã (8h-9h): 2-3 ofertas
- Almoço (12h-13h): 2-3 ofertas
- Noite (19h-21h): 3-4 ofertas (horário nobre)

---

## 6. Boas Práticas para Crescer

### Conteúdo

- **Poste consistentemente** — todos os dias, sem falta
- **Varie os templates** — não use sempre o mesmo estilo
- **Adicione foto** — posts com imagem têm mais engajamento
- **Preço real** — nunca minta sobre o preço, cheque antes de postar
- **Variedade de produtos** — misture categorias (tech, casa, auto)
- **Ofertas relâmpago** — use template "urgencia" para cupons que expiram

### Crescimento

- **Divulgue o canal no Instagram** — Stories com link para seguir
- **Bio do Instagram** — adicione "Canal WhatsApp" no link da bio (ou no site)
- **Cross-post** — mesma oferta vai pro WhatsApp E Instagram
- **Peça reações** — "Reagiu? Então corre pro link!" cria engajamento
- **Não polua** — qualidade > quantidade. Poste menos se não tiver boas ofertas

### Frequência ideal

| Dia     | Posts | Horários                        |
|---------|-------|---------------------------------|
| Seg-Sex | 5-8   | 8h, 12h, 15h, 19h, 21h         |
| Sábado  | 8-10  | Manhã e tarde (dia de compras)  |
| Domingo | 3-5   | Noite (planejamento da semana)  |

---

## 7. Erros Comuns (evite isso)

| Erro                      | Por quê é ruim                   | O que fazer                                      |
|---------------------------|----------------------------------|--------------------------------------------------|
| Postar 30+ ofertas/dia    | Seguidores silenciam o canal     | Máximo 10, foque em qualidade                    |
| Não verificar preço       | Perde credibilidade              | Sempre abra o link antes                         |
| Copiar copy de outro canal| Parece genérico                  | Use nosso gerador (tem 4 estilos)                |
| Só Amazon                 | Limita seu público               | Misture Shopee + ML + Amazon                     |
| Não postar foto           | Menos cliques                    | Sempre inclua imagem do produto                  |
| Postar link quebrado      | Perde comissão e confiança       | Teste o link antes de postar                     |
| Ignorar horários          | Menos visualizações              | Poste nos horários de pico                       |
| Nunca interagir           | Canal "morto"                    | Poste enquetes, pergunte opinião às vezes        |

---

## 8. Próximos Passos (automação futura)

O que temos hoje já resolve 80% do trabalho manual. Para o futuro:

### Curto prazo (pode fazer já)

- [ ] Configurar tag Amazon real no `link-converter.js`
- [ ] Criar conta Shopee Afiliados e ML Afiliados
- [ ] Criar o canal no WhatsApp
- [ ] Começar a postar 5 ofertas/dia
- [ ] Divulgar canal no Instagram

### Médio prazo (quando tiver volume)

- [ ] Integrar com o agente Achadin — ao cadastrar produto, já gerar copy WhatsApp automaticamente
- [ ] Criar um banco de ofertas no Notion (histórico do que já postou)
- [ ] Configurar Evolution API para envio automatizado

### Longo prazo (escala)

- [ ] Bot que monitora canais-fonte e alerta sobre boas ofertas
- [ ] Envio 100% automático (curadoria → link → copy → disparo)
- [ ] Múltiplos canais por nicho (tech, casa, auto)
- [ ] Métricas de cliques por link (encurtador com tracking)

---

## Checklist de Setup Rápido

Use esta lista para configurar tudo de uma vez:

- [ ] Baixar WhatsApp Business (se ainda não tem)
- [ ] Criar canal "Achadin BR - Ofertas"
- [ ] Configurar foto + descrição do canal
- [ ] Acessar Amazon Associates e copiar sua tag
- [ ] Editar `scripts/link-converter.js` com sua tag
- [ ] Cadastrar em Shopee Afiliados (aguardar aprovação)
- [ ] Cadastrar em ML Afiliados
- [ ] Seguir 5-10 canais de ofertas como fonte
- [ ] Testar o script com uma oferta real
- [ ] Postar primeira oferta no canal
- [ ] Divulgar o canal no Instagram (@achadinn_br)

---

## Comando de Referência Rápida

```powershell
# Gerar post completo (todos os templates)
npm run whatsapp -- "URL" --nome "Produto" --preco 99.90

# Gerar só um template específico
npm run whatsapp -- "URL" --nome "Produto" --preco 99.90 --template urgencia

# Com categoria (melhora os emojis)
npm run whatsapp -- "URL" --nome "Produto" --preco 99.90 --categoria Tecnologia

# Só converter o link (sem copy)
node scripts/link-converter.js "URL"

# Só gerar copy (quando já tem link pronto)
node scripts/whatsapp-copy.js --nome "Produto" --link "URL" --preco 99.90 --plataforma Amazon
```

---

## Resumo Visual do Fluxo

```
┌─────────────────────────────────────┐
│  CANAL DE OFERTAS (fonte)           │
│  Você segue e monitora              │
└──────────────┬──────────────────────┘
               │ copia o link
               ▼
┌─────────────────────────────────────┐
│  TERMINAL (seu PC)                  │
│  npm run whatsapp -- "URL" ...      │
│  → converte link + gera copy        │
└──────────────┬──────────────────────┘
               │ copia a copy
               ▼
┌─────────────────────────────────────┐
│  SEU CANAL WHATSAPP                 │
│  Cola a copy + foto do produto      │
│  Seguidores veem e clicam           │
└──────────────┬──────────────────────┘
               │ clique no link
               ▼
┌─────────────────────────────────────┐
│  LOJA (Amazon/Shopee/ML)            │
│  Compra com sua tag → comissão      │
└─────────────────────────────────────┘
```

---

*Última atualização: Agosto 2026*
