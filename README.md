# Frontend - Job Finder

Aplicacao React + Vite responsavel pela interface do Job Finder.

## O que existe aqui

- autenticacao com token salvo no `localStorage`
- listagem de vagas recomendadas
- paginacao com navegacao por numero de pagina
- dashboard com upload e download de curriculo
- favoritos e recuperacao de senha

## Tecnologias

- React
- Vite
- Axios
- ESLint

## Requisitos

- Node.js 18+ recomendado
- npm
- backend rodando em `http://127.0.0.1:8000`

## Instalar dependencias

```bash
npm install
```

## Rodar em desenvolvimento

```bash
npm run dev
```

Por padrao, o Vite sobe a aplicacao em ambiente local e o frontend consome a API configurada em `src/services/api.js`.

## Gerar build de producao

```bash
npm run build
```

## Visualizar build localmente

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Estrutura principal

- `src/App.jsx`: controle de rotas internas, autenticacao e carregamento de vagas
- `src/components/`: componentes reutilizaveis como cards, navbar e paginacao
- `src/pages/`: telas de login, cadastro, favoritos, dashboard e recuperacao de senha
- `src/services/api.js`: cliente Axios com `baseURL` da API e envio automatico do token

## Integracao com o backend

O frontend usa Axios apontando para:

```txt
http://127.0.0.1:8000
```

Se o backend rodar em outra URL, ajuste `src/services/api.js`.

## Fluxo basico de uso

1. criar conta ou fazer login
2. acessar o dashboard e enviar o curriculo em PDF
3. voltar para a tela principal para ver as vagas recomendadas
4. navegar entre as paginas, salvar favoritos e consultar o dashboard

## Observacoes

- o token e salvo no navegador via `localStorage`
- a paginacao depende do campo `totalPages` retornado pelo backend
- o upload de curriculo espera arquivos PDF
