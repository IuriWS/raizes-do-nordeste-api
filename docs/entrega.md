# Pacote de Entrega

Este documento descreve como gerar uma copia limpa do projeto para envio, revisao academica ou apresentacao tecnica.

## Gerar pacote

Na raiz do projeto:

```bash
npm run package:delivery
```

O script cria:

```text
entrega/raizes-do-nordeste-api-entrega.zip
```

## Conteudo incluido

- Codigo-fonte `src/`.
- Testes `test/`.
- Schema, migrations e seed Prisma.
- Documentacao `docs/`.
- Diagramas renderizados e PDF final.
- Collection e environment Postman.
- Dockerfile e Docker Compose.
- Configuracoes TypeScript, NestJS, Jest e Prisma.
- Arquivos `package.json` e `package-lock.json`.

## Conteudo excluido

- Dependencias instaladas.
- Build local.
- Coverage.
- Arquivos temporarios.
- Variaveis reais de ambiente.
- Arquivos internos de validacao.

## Validacao antes de enviar

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm run package:delivery
```

Antes do envio, abra o zip e confira se a raiz contem `README.md`, `src/`, `docs/`, `prisma/`, `postman/` e os arquivos Docker.

Use tambem `docs/checklist-final.md` para conferir execucao, testes, Swagger, Postman, diagramas e PDF final.
