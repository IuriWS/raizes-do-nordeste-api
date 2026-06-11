# Rollback Local

Este runbook descreve como voltar o ambiente local a um estado anterior quando uma subida Docker, migration ou seed falhar.

## Parar containers

```bash
docker compose down
```

Esse comando para API e banco sem apagar o volume local.

## Recriar somente a API

Use quando a falha está na imagem, nas dependências ou no build da API:

```bash
docker compose build --no-cache api
docker compose up -d api
```

## Restaurar banco de demonstração

Use quando os dados locais podem ser descartados:

```bash
docker compose down -v
docker compose up --build -d
docker compose exec api npm run prisma:seed
```

O volume será removido e o banco voltara ao estado inicial definido pelo seed.

## Reaplicar migrations

Se a API subiu, mas as tabelas não existem ou estão desatualizadas:

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run prisma:seed
```

## Conferência após rollback

```bash
docker compose ps
curl -I http://localhost:3000/api/docs
```

Depois disso, valide login, criação de pedido e pagamento mock antes de continuar novos testes.
