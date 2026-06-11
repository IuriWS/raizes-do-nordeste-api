# Seguranca

Este documento resume controles de seguranca aplicados na API.

## Credenciais

- Senhas sao armazenadas com bcrypt.
- Respostas públicas não retornam `senhaHash`.
- Tokens JWT usam `JWT_SECRET` configuravel por ambiente.

## Autorizacao

Rotas protegidas usam JWT e controle por perfil. Endpoints publicos devem ser mantidos no menor escopo possivel.

O cadastro publico cria apenas clientes. Perfis internos devem ser provisionados por fluxo controlado.

## Dados pessoais

A API armazena dados minimos para o estudo de caso:

- Nome.
- Email.
- Telefone.
- CPF quando informado.
- Consentimento de fidelidade.

Dados pessoais não devem aparecer em respostas que não precisem deles.

## Pedidos e pagamentos

Clientes só podem consultar ou processar pagamento de pedidos próprios. Pedidos de outros clientes devem retornar erro de permissão.

Pagamento mock so pode ser processado enquanto o pedido esta em `AGUARDANDO_PAGAMENTO` e o pagamento esta `PENDENTE`.

## Estoque

Pedidos reservam estoque no momento da criacao. Cancelamentos de pedidos que ainda mantem reserva devem restaurar o estoque para evitar perda artificial de disponibilidade.

## Auditoria

Acoes sensiveis registram auditoria:

- Login.
- Cadastro.
- Criacao e cancelamento de pedido.
- Atualizacao de status.
- Pagamento aprovado ou recusado.
- Movimentacao de estoque.
- Resgate de fidelidade.

## Validacao

Use:

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm audit --omit=dev
```
