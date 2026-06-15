# Pacote do Projeto

Este documento descreve como gerar um arquivo compactado com os arquivos necessários para executar, testar e revisar a API.

## Gerar pacote

Na raiz do projeto:

```bash
npm run package:delivery
```

O script cria:

```text
pacote/raizes-do-nordeste-api.zip
```

## Conteúdo incluído

- Código-fonte `src/`.
- Testes `test/`.
- Schema, migrations e seed Prisma.
- Documentação `docs/`.
- Diagramas renderizados e relatório técnico em PDF.
- Collection e environment Postman.
- Dockerfile e Docker Compose.
- Configurações TypeScript, NestJS, Jest e Prisma.
- Arquivos `package.json` e `package-lock.json`.

## Conteúdo excluído

- Dependências instaladas.
- Build local.
- Coverage.
- Arquivos temporários.
- Variáveis reais de ambiente.
- Arquivos locais de validação.

## Validação do pacote

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm run package:delivery
```

Depois de gerar o arquivo, abra o zip e confira se a raiz contém `README.md`, `src/`, `docs/`, `prisma/`, `postman/` e os arquivos Docker.

Use também `docs/verificacao-tecnica.md` para conferir execução, testes, Swagger, Postman, diagramas e relatório técnico.
