# LGPD e Segurança

## Dados pessoais tratados

- Nome e email do usuário.
- Telefone e CPF opcional do cliente.
- Consentimento para fidelidade.
- Histórico de pedidos e movimentos de fidelidade.

## Finalidade

Os dados são usados para autenticação, criação de pedidos, identificação do cliente, programa de fidelidade e auditoria de ações sensíveis.

## Medidas implementadas

- Hash de senha com bcrypt.
- Autenticação JWT.
- Controle de acesso por perfil.
- Remocao de `senhaHash` nas respostas.
- Auditoria para login, pedido, pagamento, estoque e fidelidade.
- Consentimento explicito para participar da fidelidade.
- Pagamento mock sem integração com provedor real.

## Retenção e anonimização

Em um ambiente real, a política deve definir prazo de retenção para pedidos, auditoria e dados pessoais. A anonimização pode substituir nome, email, telefone e CPF quando não houver mais finalidade legítima para manter esses dados identificáveis.

## Cuidados recomendados

- Trocar `JWT_SECRET` em cada ambiente.
- Usar HTTPS em produção.
- Restringir acesso direto ao banco.
- Registrar incidentes e revisar auditorias.
- Evitar salvar dados sensíveis em logs.
