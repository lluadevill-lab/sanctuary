# Sanctuary Codex

Companion não-oficial para o servidor **Diablo II Evolution** (diablo2.com.br).
Busca de personagens, "meus personagens" e favoritos, histórico de busca,
conquistas, calculadora de Runewords (98 receitas, patches 1.09 até 2.6 +
Reign of the Warlock) e as páginas de Mapas e Biblioteca do servidor
embutidas dentro da UI do app.

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind** no front, **Supabase**
(Postgres + Auth) no back, deploy na **Vercel**, código no **GitHub**.

> Este projeto não é afiliado à Blizzard Entertainment nem ao servidor
> Diablo II Evolution. Os dados de Runewords foram digitados a partir de
> material público de referência do próprio jogo.

---

## 0. O que você precisa ter em mãos

- Conta no [GitHub](https://github.com) (você já tem)
- Conta no [Supabase](https://supabase.com) (você já tem)
- Conta na [Vercel](https://vercel.com) — pode entrar direto com o GitHub
- Node.js 18+ instalado na sua máquina (para testar localmente, opcional)

---

## 1. Criar o projeto no Supabase

1. Entre em [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Escolha um nome (ex: `sanctuary-codex`), uma senha forte para o banco e a região mais próxima (São Paulo, se disponível).
3. Espere o projeto terminar de provisionar (~2 min).
4. No menu lateral, vá em **SQL Editor** → **New query**.
5. Abra o arquivo `supabase/schema.sql` deste projeto, copie **todo o conteúdo** e cole no editor.
6. Clique em **Run**. Isso cria todas as tabelas (`profiles`, `characters`,
   `search_history`, `runeword_views`, `achievements`, `user_achievements`),
   as políticas de segurança (RLS) e já popula o catálogo de conquistas.
7. Vá em **Project Settings → API**. Você vai precisar de dois valores:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (uma chave longa)

### Configurar autenticação por e-mail

Em **Authentication → Providers**, o provedor de **Email** já vem habilitado
por padrão. Duas opções:

- **Mais simples para testar**: em **Authentication → Settings**, desative
  "Confirm email" temporariamente, assim o cadastro já loga direto.
- **Mais correto para produção**: deixe a confirmação de e-mail ligada. O
  app já trata esse fluxo (mostra "verifique seu e-mail" e tem uma rota
  `/auth/callback` pronta para o link de confirmação funcionar).

Se for usar confirmação por e-mail, em **Authentication → URL Configuration**
adicione a URL do seu site (depois do deploy na Vercel) em **Redirect URLs**,
por exemplo: `https://seu-app.vercel.app/auth/callback`.

---

## 2. Colocar suas fotos de perfil

As imagens de avatar ficam em `public/avatars/`. Já vêm 6 avatares abstratos
de exemplo (círculos com losango, sem nenhum personagem com direitos
autorais). Para usar as suas:

1. Apague ou mantenha os arquivos de exemplo em `public/avatars/`.
2. Coloque seus próprios arquivos `.png`, `.jpg`, `.jpeg`, `.webp` ou `.gif`
   nessa mesma pasta.
3. Pronto — o app **escaneia essa pasta automaticamente** no `npm run dev`
   e no `npm run build` (script `scripts/generate-avatars.mjs`) e gera a
   lista de avatares disponíveis. Você não precisa editar nenhum código.

---

## 3. Rodar localmente (opcional, mas recomendado antes do deploy)

```bash
cd app
npm install
cp .env.local.example .env.local
# edite .env.local com a URL e a anon key do seu projeto Supabase
npm run dev
```

Abra `http://localhost:3000`.

---

## 4. Subir para o GitHub

Dentro da pasta `app/`:

```bash
git init
git add .
git commit -m "Sanctuary Codex - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sanctuary-codex.git
git push -u origin main
```

(Crie o repositório vazio antes em github.com/new — sem README, sem
.gitignore, para não dar conflito.)

---

## 5. Deploy na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório que
   você acabou de subir.
2. Framework Preset: a Vercel já detecta **Next.js** automaticamente.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = a URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = a anon key do seu projeto Supabase
4. Clique em **Deploy**.
5. Quando terminar, copie a URL gerada (`https://seu-app.vercel.app`) e
   volte no Supabase para adicionar essa URL nas **Redirect URLs** de
   autenticação (ver seção 1), caso use confirmação de e-mail.

Pronto — toda vez que você der `git push`, a Vercel refaz o deploy
automaticamente.

---

## Estrutura do projeto

```
app/
├─ scripts/generate-avatars.mjs   # gera a lista de avatares a partir de public/avatars
├─ supabase/schema.sql            # schema completo do banco (rodar 1x no SQL Editor)
├─ public/avatars/                # suas fotos de perfil
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                 # Home (busca + meus personagens/favoritos)
│  │  ├─ char/[name]/page.tsx     # Página de personagem (embed do Armory real)
│  │  ├─ runewords/page.tsx       # Busca + calculadora + tabela de runas
│  │  ├─ maps/page.tsx            # Embed de diablo2.com.br/areas/
│  │  ├─ library/page.tsx         # Embed de diablo2.com.br/library/
│  │  ├─ profile/page.tsx         # Perfil, avatar, listas, conquistas
│  │  ├─ login/  signup/          # Autenticação
│  │  └─ auth/callback/route.ts   # Callback de confirmação de e-mail
│  ├─ components/                 # Todos os componentes de UI
│  ├─ lib/
│  │  ├─ actions.ts               # Server Actions (favoritar, buscar, avatar, conquistas...)
│  │  └─ supabase/                # Clientes Supabase (browser, server, middleware)
│  ├─ data/
│  │  ├─ runewords.json           # 98 runewords estruturadas
│  │  ├─ runes.json               # 33 runas base
│  │  └─ avatars.generated.json   # gerado automaticamente, não editar à mão
│  └─ types/index.ts
```

## Como funcionam as principais features

- **Busca de personagem**: digita o nome exato → vai para `/char/NOME`,
  que embute `https://diablo2.com.br/char/NOME/` dentro da UI do app (o
  menu do Codex continua fixo por cima, como pedido).
- **Meus personagens / Favoritos**: qualquer usuário logado pode marcar um
  personagem em duas categorias independentes na própria página dele.
- **Histórico de busca**: toda busca feita logado é salva e aparece no
  perfil e na home.
- **Conquistas**: calculadas automaticamente com base em contadores (buscas,
  personagens marcados, favoritos, runewords consultadas). O catálogo fica
  na tabela `achievements` — dá para adicionar novas direto pelo SQL Editor.
- **Runewords**: os dados vieram do texto que você mandou, já parseados
  (98 receitas). A calculadora deixa marcar quantas cópias de cada runa
  você tem e mostra o que já dá pra forjar (lembrando de respeitar a ordem
  de inserção de cada receita, que aparece no card de detalhe).

## Observação sobre os iframes (Personagem / Mapas / Biblioteca)

O app carrega essas páginas via `<iframe>` de dentro do próprio
diablo2.com.br. Se em algum momento o site deles bloquear incorporação
(headers `X-Frame-Options` / `Content-Security-Policy: frame-ancestors`),
o navegador impede o carregamento por segurança — isso é uma decisão do
lado do diablo2.com.br, não um bug do app. Por isso cada página embutida
já tem um aviso automático + botão "Abrir em nova aba" caso o carregamento
demore ou falhe.

## Próximos passos sugeridos (não incluídos ainda)

- Upload de foto de perfil pelo próprio usuário (hoje é só escolher entre
  as imagens da pasta `public/avatars/`) — daria pra usar o Supabase
  Storage para isso.
- Paginação/infinite scroll na lista de Runewords se você expandir os dados.
- Notificações quando uma conquista é desbloqueada (hoje ela só aparece
  "revelada" ao recarregar a página de perfil).
