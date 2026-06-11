# LGPD e Seguranca

## Dados pessoais tratados

- Nome e email do usuario.
- Telefone e CPF opcional do cliente.
- Consentimento para fidelidade.
- Historico de pedidos e movimentos de fidelidade.

## Finalidade

Os dados sao usados para autenticacao, criacao de pedidos, identificacao do cliente, programa de fidelidade e auditoria de acoes sensiveis.

## Medidas implementadas

- Hash de senha com bcrypt.
- Autenticacao JWT.
- Controle de acesso por perfil.
- Remocao de `senhaHash` nas respostas.
- Auditoria para login, pedido, pagamento, estoque e fidelidade.
- Consentimento explicito para participar da fidelidade.
- Pagamento mock sem integracao com provedor real.

## Retencao e anonimizacao

Em um ambiente real, a política deve definir prazo de retenção para pedidos, auditoria e dados pessoais. A anonimização pode substituir nome, email, telefone e CPF quando não houver mais finalidade legítima para manter esses dados identificáveis.

## Cuidados recomendados

- Trocar `JWT_SECRET` em cada ambiente.
- Usar HTTPS em producao.
- Restringir acesso direto ao banco.
- Registrar incidentes e revisar auditorias.
- Evitar salvar dados sensiveis em logs.
