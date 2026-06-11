# Testes

## Testes automatizados

Unitarios:

```bash
npm test
```

A suite atual cobre regras puras de fidelidade:

- Pontos por valor pago.
- Desconto conceitual por pontos.
- Bloqueio de resgate acima do saldo.

E2E:

```bash
npm run test:e2e
```

A suite e2e usa a API NestJS por HTTP e banco PostgreSQL configurado em `DATABASE_URL`. Rode em um banco descartavel de desenvolvimento, pois o teste limpa tabelas antes de cada cenário.

No WSL com Docker Compose, use:

```bash
docker compose up -d postgres
docker compose run --rm api npm run test:e2e
```

Ela cobre:

- Login e proteção para não expor `senhaHash`.
- Cadastro público restrito ao perfil CLIENTE.
- Acesso sem token.
- Bloqueio por perfil.
- Criação de pedido multicanal.
- Pagamento mock aprovado.
- Pagamento mock recusado com restauracao de estoque.
- Bloqueio de pagamento de pedido alheio.
- Cancelamento com restauracao de estoque e bloqueio de pagamento posterior.
- Validação de `canalPedido`.
- Filtro de pedidos por canal.
- Consulta de estoque por perfil autorizado.

## Checks de qualidade

```bash
npm run lint
npm run build
npm run test:e2e
npm audit --omit=dev
```

## Testes manuais

Use a collection:

```text
postman/raizes-do-nordeste.postman_collection.json
```

Environment:

```text
postman/raizes-do-nordeste.postman_environment.json
```

Fluxo recomendado:

1. Login válido.
2. Criar pedido válido.
3. Processar pagamento aprovado.
4. Criar outro pedido.
5. Processar pagamento recusado.
6. Consultar pedidos por canal.
7. Consultar auditoria.

## Evidências esperadas

- `npm test` com testes unitarios passando.
- `npm run test:e2e` com fluxo HTTP e banco passando.
- `npm run build` sem erro TypeScript.
- `npm audit --omit=dev` sem vulnerabilidades de produção.
- Postman com retornos 200, 201, 401, 403, 404, 409 e 422 conforme o cenário.
