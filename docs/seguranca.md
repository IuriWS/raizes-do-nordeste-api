# Segurança

Este documento resume controles de segurança aplicados na API.

## Credenciais

- Senhas são armazenadas com bcrypt.
- Respostas públicas não retornam `senhaHash`.
- Tokens JWT usam `JWT_SECRET` configuravel por ambiente.

## Autorização

Rotas protegidas usam JWT e controle por perfil. Endpoints públicos devem ser mantidos no menor escopo possível.

O cadastro público cria apenas clientes. Perfis administrativos devem ser provisionados por fluxo controlado.

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

Pagamento mock só pode ser processado enquanto o pedido está em `AGUARDANDO_PAGAMENTO` e o pagamento está `PENDENTE`.

## Estoque

Pedidos reservam estoque no momento da criação. Cancelamentos de pedidos que ainda mantém reserva devem restaurar o estoque para evitar perda artificial de disponibilidade.

## Auditoria

Ações sensíveis registram auditoria:

- Login.
- Cadastro.
- Criação e cancelamento de pedido.
- Atualização de status.
- Pagamento aprovado ou recusado.
- Movimentacao de estoque.
- Resgate de fidelidade.

## Validação

Use:

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm audit --omit=dev
```
