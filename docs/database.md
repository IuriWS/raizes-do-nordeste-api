# Banco de Dados

## Subir API e PostgreSQL no WSL

```bash
docker compose up --build -d
docker compose exec api npm run prisma:seed
```

Esse fluxo cria a imagem da API, sobe o PostgreSQL, aplica migrations no inicio do container da API e carrega os dados de demonstracao pelo seed.

## Subir somente PostgreSQL

```bash
docker compose up -d postgres
```

## Variavel de ambiente

Copie `.env.example` para `.env` e mantenha:

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/raizes_do_nordeste?schema=public"
```

## Migration

Gerar e aplicar migration em ambiente local:

```bash
npm run prisma:migrate -- --name init
```

A migration inicial ja esta versionada em:

```text
prisma/migrations/20260609000000_init/migration.sql
```

## Seed

```bash
npm run prisma:seed
```

O seed cria usuários por perfil, duas unidades, cinco produtos, cardápio, estoque inicial e fidelidade do cliente demo.

## Validacoes uteis

```bash
npm run prisma:generate
npx prisma validate
```

## Problemas comuns

- Se o Docker Desktop estiver fechado, `docker compose up -d` não consegue acessar o daemon.
- Se `DATABASE_URL` estiver ausente, comandos Prisma falham antes de conectar no banco.
- Se a porta 5432 estiver ocupada, altere a porta local no `docker-compose.yml`.
