export const erroValidacaoExample = {
  error: 'VALIDATION_ERROR',
  message: 'Dados invalidos.',
  details: [{ field: 'canalPedido', issue: 'canalPedido must be one of the following values: APP, TOTEM, BALCAO, PICKUP, WEB' }],
  timestamp: '2026-06-09T12:00:00.000Z',
  path: '/pedidos',
  requestId: 'req-123'
};

export const erroNaoAutorizadoExample = {
  error: 'UNAUTHORIZED',
  message: 'Token JWT ausente.',
  details: [],
  timestamp: '2026-06-09T12:00:00.000Z',
  path: '/pedidos'
};

export const erroSemPermissaoExample = {
  error: 'FORBIDDEN',
  message: 'Perfil sem permissão para este recurso.',
  details: [],
  timestamp: '2026-06-09T12:00:00.000Z',
  path: '/produtos'
};

export const loginResponseExample = {
  accessToken: 'jwt.demo.token',
  usuario: {
    id: 5,
    nome: 'Cliente Demo',
    email: 'cliente@raizes.com',
    role: 'CLIENTE',
    ativo: true
  }
};

export const pedidoResponseExample = {
  id: 1,
  clienteId: 1,
  unidadeId: 1,
  canalPedido: 'TOTEM',
  status: 'AGUARDANDO_PAGAMENTO',
  total: '12.5',
  itens: [{ id: 1, pedidoId: 1, produtoId: 1, quantidade: 1, precoUnitario: '12.5', subtotal: '12.5' }],
  pagamento: { id: 1, pedidoId: 1, formaPagamento: 'MOCK', status: 'PENDENTE', valor: '12.5' }
};

export const pagamentoAprovadoResponseExample = {
  id: 1,
  clienteId: 1,
  unidadeId: 1,
  canalPedido: 'TOTEM',
  status: 'PAGO',
  total: '12.5',
  pagamento: { id: 1, pedidoId: 1, formaPagamento: 'MOCK', status: 'APROVADO', valor: '12.5' }
};
