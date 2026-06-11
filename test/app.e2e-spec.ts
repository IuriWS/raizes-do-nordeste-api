import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CanalPedido, FormaPagamento, PagamentoStatus, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

const prisma = new PrismaClient();
const senhaCliente = 'Cliente@123';
const senhaOutroCliente = 'Outro@123';
const senhaGerente = 'Gerente@123';

describe('API principal (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let ids: { unidadeId: number; produtoId: number };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'dev-secret';
    process.env.JWT_EXPIRES_IN = '1d';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    ids = await resetarBancoParaTeste();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  async function login(email: string, senha: string) {
    const response = await request(httpServer).post('/auth/login').send({ email, senha }).expect(200);
    return response.body.accessToken as string;
  }

  async function criarPedido(accessToken: string, quantidade = 1, canalPedido: CanalPedido = CanalPedido.TOTEM) {
    const response = await request(httpServer)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        unidadeId: ids.unidadeId,
        canalPedido,
        formaPagamento: FormaPagamento.MOCK,
        itens: [{ produtoId: ids.produtoId, quantidade }]
      })
      .expect(201);

    return response.body;
  }

  it('autentica usuário seedado sem expor senhaHash', async () => {
    const response = await request(httpServer)
      .post('/auth/login')
      .send({ email: 'cliente@raizes.test', senha: senhaCliente })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.usuario.email).toBe('cliente@raizes.test');
    expect(response.body.usuario.senhaHash).toBeUndefined();
  });

  it('cadastro público sempre cria cliente e rejeita role interno', async () => {
    await request(httpServer)
      .post('/auth/register')
      .send({
        nome: 'Tentativa Admin',
        email: 'tentativa-admin@raizes.test',
        senha: 'Admin@123',
        role: Role.ADMIN,
        consentimentoFidelidade: true
      })
      .expect(422);

    const response = await request(httpServer)
      .post('/auth/register')
      .send({
        nome: 'Cliente Registrado',
        email: 'registrado@raizes.test',
        senha: 'Cliente@123',
        telefone: '85911112222',
        consentimentoFidelidade: true
      })
      .expect(201);

    expect(response.body.role).toBe(Role.CLIENTE);
    expect(response.body.senhaHash).toBeUndefined();
  });

  it('bloqueia acesso sem token e perfil sem permissão', async () => {
    await request(httpServer).get('/pedidos').expect(401);

    const tokenCliente = await login('cliente@raizes.test', senhaCliente);
    await request(httpServer)
      .post('/produtos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ nome: 'Produto bloqueado', descricao: 'Criação proibida para cliente.', preco: 10, ativo: true })
      .expect(403);
  });

  it('cria pedido multicanal, aprova pagamento e credita fidelidade', async () => {
    const tokenCliente = await login('cliente@raizes.test', senhaCliente);
    const pedido = await criarPedido(tokenCliente, 1);

    expect(pedido.status).toBe('AGUARDANDO_PAGAMENTO');
    expect(pedido.canalPedido).toBe(CanalPedido.TOTEM);

    const pagamento = await request(httpServer)
      .post(`/pagamentos/mock/${pedido.id}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ resultado: PagamentoStatus.APROVADO })
      .expect(200);

    expect(pagamento.body.status).toBe('PAGO');
    expect(pagamento.body.pagamento.status).toBe(PagamentoStatus.APROVADO);

    const saldo = await request(httpServer)
      .get('/fidelidade/saldo')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .expect(200);

    expect(saldo.body.saldoPontos).toBe(12);
  });

  it('restaura estoque quando pagamento mock é recusado', async () => {
    const tokenCliente = await login('cliente@raizes.test', senhaCliente);
    const pedido = await criarPedido(tokenCliente, 2);

    await request(httpServer)
      .post(`/pagamentos/mock/${pedido.id}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ resultado: PagamentoStatus.RECUSADO })
      .expect(200);

    const estoque = await prisma.estoque.findUniqueOrThrow({
      where: { unidadeId_produtoId: { unidadeId: ids.unidadeId, produtoId: ids.produtoId } }
    });

    expect(estoque.quantidadeAtual).toBe(10);
  });

  it('bloqueia pagamento de pedido alheio para cliente', async () => {
    const tokenCliente = await login('cliente@raizes.test', senhaCliente);
    const tokenOutroCliente = await login('outro@raizes.test', senhaOutroCliente);
    const pedido = await criarPedido(tokenCliente, 1);

    await request(httpServer)
      .post(`/pagamentos/mock/${pedido.id}`)
      .set('Authorization', `Bearer ${tokenOutroCliente}`)
      .send({ resultado: PagamentoStatus.APROVADO })
      .expect(403);

    await request(httpServer)
      .get(`/pagamentos/${pedido.id}`)
      .set('Authorization', `Bearer ${tokenOutroCliente}`)
      .expect(403);
  });

  it('restaura estoque no cancelamento e impede pagamento posterior', async () => {
    const tokenCliente = await login('cliente@raizes.test', senhaCliente);
    const pedido = await criarPedido(tokenCliente, 2);

    await request(httpServer)
      .delete(`/pedidos/${pedido.id}/cancelar`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .expect(200);

    const estoque = await prisma.estoque.findUniqueOrThrow({
      where: { unidadeId_produtoId: { unidadeId: ids.unidadeId, produtoId: ids.produtoId } }
    });
    expect(estoque.quantidadeAtual).toBe(10);

    await request(httpServer)
      .post(`/pagamentos/mock/${pedido.id}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ resultado: PagamentoStatus.APROVADO })
      .expect(409);
  });

  it('valida canal obrigatório e permite filtro por canal', async () => {
    const tokenCliente = await login('cliente@raizes.test', senhaCliente);

    await request(httpServer)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        unidadeId: ids.unidadeId,
        formaPagamento: FormaPagamento.MOCK,
        itens: [{ produtoId: ids.produtoId, quantidade: 1 }]
      })
      .expect(422);

    await criarPedido(tokenCliente, 1, CanalPedido.TOTEM);
    await criarPedido(tokenCliente, 1, CanalPedido.WEB);

    const response = await request(httpServer)
      .get('/pedidos?canalPedido=TOTEM')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].canalPedido).toBe(CanalPedido.TOTEM);
  });

  it('permite gerente consultar estoque após reserva de pedido', async () => {
    const tokenCliente = await login('cliente@raizes.test', senhaCliente);
    const tokenGerente = await login('gerente@raizes.test', senhaGerente);
    await criarPedido(tokenCliente, 3);

    const response = await request(httpServer)
      .get(`/estoque/${ids.unidadeId}/${ids.produtoId}`)
      .set('Authorization', `Bearer ${tokenGerente}`)
      .expect(200);

    expect(response.body.quantidadeAtual).toBe(7);
  });
});

async function resetarBancoParaTeste() {
  await prisma.$transaction([
    prisma.auditoria.deleteMany(),
    prisma.movimentoFidelidade.deleteMany(),
    prisma.fidelidade.deleteMany(),
    prisma.pagamento.deleteMany(),
    prisma.itemPedido.deleteMany(),
    prisma.pedido.deleteMany(),
    prisma.movimentoEstoque.deleteMany(),
    prisma.estoque.deleteMany(),
    prisma.cardapioUnidade.deleteMany(),
    prisma.produto.deleteMany(),
    prisma.cliente.deleteMany(),
    prisma.usuario.deleteMany(),
    prisma.promocao.deleteMany(),
    prisma.unidade.deleteMany()
  ]);

  const [senhaHashCliente, senhaHashOutroCliente, senhaHashGerente] = await Promise.all([
    bcrypt.hash(senhaCliente, 10),
    bcrypt.hash(senhaOutroCliente, 10),
    bcrypt.hash(senhaGerente, 10)
  ]);

  const usuarioCliente = await prisma.usuario.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente@raizes.test',
      senhaHash: senhaHashCliente,
      role: Role.CLIENTE,
      ativo: true
    }
  });

  await prisma.usuario.create({
    data: {
      nome: 'Gerente Teste',
      email: 'gerente@raizes.test',
      senhaHash: senhaHashGerente,
      role: Role.GERENTE,
      ativo: true
    }
  });

  const outroUsuarioCliente = await prisma.usuario.create({
    data: {
      nome: 'Outro Cliente Teste',
      email: 'outro@raizes.test',
      senhaHash: senhaHashOutroCliente,
      role: Role.CLIENTE,
      ativo: true
    }
  });

  const cliente = await prisma.cliente.create({
    data: {
      usuarioId: usuarioCliente.id,
      telefone: '85999990000',
      cpf: '00000000001',
      consentimentoFidelidade: true,
      dataConsentimento: new Date()
    }
  });

  await prisma.fidelidade.create({ data: { clienteId: cliente.id, saldoPontos: 0 } });

  const outroCliente = await prisma.cliente.create({
    data: {
      usuarioId: outroUsuarioCliente.id,
      telefone: '85999990001',
      cpf: '00000000002',
      consentimentoFidelidade: true,
      dataConsentimento: new Date()
    }
  });

  await prisma.fidelidade.create({ data: { clienteId: outroCliente.id, saldoPontos: 0 } });

  const unidade = await prisma.unidade.create({
    data: {
      nome: 'Unidade Teste',
      cidade: 'Fortaleza',
      endereco: 'Rua dos Testes, 100',
      ativa: true
    }
  });

  const produto = await prisma.produto.create({
    data: {
      nome: 'Cuscuz de teste',
      descricao: 'Produto usado nos testes automatizados.',
      preco: 12.5,
      ativo: true
    }
  });

  await prisma.cardapioUnidade.create({
    data: {
      unidadeId: unidade.id,
      produtoId: produto.id,
      disponivel: true
    }
  });

  await prisma.estoque.create({
    data: {
      unidadeId: unidade.id,
      produtoId: produto.id,
      quantidadeAtual: 10,
      quantidadeMinima: 2
    }
  });

  return { unidadeId: unidade.id, produtoId: produto.id };
}
