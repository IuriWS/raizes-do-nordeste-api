# Deploy Local com Docker

Este runbook descreve o deploy local da API com Docker Compose, usado para validação no WSL e demonstração do estudo de caso.

## Pré-requisitos

- Docker Desktop instalado e integrado ao WSL.
- Distribuição Ubuntu disponível no WSL.
- Portas `3000` e `5432` livres na máquina.

## Subir ambiente

No diretório raiz do projeto:

```bash
docker compose up --build -d
docker compose exec api npm run prisma:seed
```

O comando constrói a imagem da API, sobe o PostgreSQL e inicia o servidor NestJS. O container da API aplica migrations automaticamente antes de iniciar.

## Conferir saúde

```bash
docker compose ps
curl -I http://localhost:3000/api/docs
```

Resultado esperado:

- `raizes_postgres` com estado `healthy`.
- `raizes_api` com estado `running`.
- Swagger respondendo HTTP `200`.

## Logs

```bash
docker logs -f raizes_api
docker logs -f raizes_postgres
```

Use os logs para verificar inicialização, migrations, erros de conexão com banco e mapeamento de rotas.

## Encerrar ambiente

```bash
docker compose down
```

Para remover também o volume do banco local:

```bash
docker compose down -v
```

Use `-v` apenas quando for aceitável apagar os dados locais de demonstração.
