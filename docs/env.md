# Variáveis de Ambiente

Este documento lista as variáveis usadas pela API e pelo ambiente Docker local.

## API

| Variável | Exemplo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/raizes_do_nordeste?schema=public` | Sim | String de conexão do Prisma com PostgreSQL. |
| `JWT_SECRET` | `dev-secret` | Sim | Chave usada para assinar tokens JWT. Em ambiente real, use valor longo e privado. |
| `JWT_EXPIRES_IN` | `1d` | Sim | Tempo de validade dos tokens emitidos no login. |
| `PORT` | `3000` | Não | Porta HTTP da API. |

## Docker Compose

Dentro do Compose, a API usa o host `postgres` na `DATABASE_URL`, porque os containers estao na mesma rede Docker:

```text
postgresql://postgres:postgres@postgres:5432/raizes_do_nordeste?schema=public
```

Em execução local fora do Docker, use `localhost`:

```text
postgresql://postgres:postgres@localhost:5432/raizes_do_nordeste?schema=public
```

## Boas praticas

- Não versionar `.env` com segredos reais.
- Trocar `JWT_SECRET` antes de publicar fora do ambiente local.
- Manter `.env.example` como referência sem dados sensíveis.
- Revisar a string de banco antes de rodar migrations em qualquer ambiente compartilhado.
