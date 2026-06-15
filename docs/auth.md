# Autenticação e Autorização

Este documento descreve as regras de login, cadastro, token JWT e permissão por perfil da API.

## Login

`POST /auth/login` recebe email e senha, valida a senha com bcrypt e retorna um `accessToken` JWT quando as credenciais são válidas.

Resposta esperada:

```http
200 OK
```

O retorno nunca deve expor `senhaHash`.

## Cadastro público

`POST /auth/register` é público, mas cria apenas usuários do perfil `CLIENTE`.

Perfis administrativos como `ADMIN`, `GERENTE`, `COZINHA` e `ATENDENTE` devem ser criados por seed, rotina administrativa ou processo controlado. O cadastro público não pode aceitar escolha de perfil privilegiado.

## JWT

O token carrega apenas os campos necessários para autorização:

- `sub`: identificador do usuário.
- `email`: email autenticado.
- `role`: perfil de acesso.

## Perfis

- `ADMIN`: acesso administrativo completo.
- `GERENTE`: gestão de catálogo, estoque, pedidos, promoções e auditoria.
- `COZINHA`: consulta pedidos e atualiza preparo.
- `ATENDENTE`: cria pedidos operacionais e consulta pedidos.
- `CLIENTE`: cria e consulta os próprios pedidos, pagamentos e fidelidade.

## Posse de recurso

Quando o perfil é `CLIENTE`, a API deve garantir que o usuário acesse apenas recursos ligados ao seu próprio cadastro de cliente. Isso vale para:

- Consulta de pedidos.
- Consulta de pagamento.
- Processamento de pagamento mock.
- Fidelidade.

## Validação

Use:

```bash
npm run lint
npm test
npm run test:e2e
```

Os testes e2e devem cobrir login, acesso sem token, bloqueio por perfil e tentativa de acesso a recurso de outro cliente.
