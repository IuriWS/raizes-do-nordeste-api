# Pacote de Entrega

Este documento descreve como gerar uma cópia limpa do projeto para envio, revisão ou apresentação técnica.

## Gerar pacote

Na raiz do projeto:

```bash
npm run package:delivery
```

O script cria:

```text
entrega/raizes-do-nordeste-api-entrega.zip
```

## Conteúdo incluído

- Código-fonte `src/`.
- Testes `test/`.
- Schema, migrations e seed Prisma.
- Documentação `docs/`.
- Diagramas renderizados e PDF final.
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

## Validação antes de enviar

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm run package:delivery
```

Antes do envio, abra o zip e confira se a raiz contém `README.md`, `src/`, `docs/`, `prisma/`, `postman/` e os arquivos Docker.

Use também `docs/checklist-final.md` para conferir execução, testes, Swagger, Postman, diagramas e PDF final.
