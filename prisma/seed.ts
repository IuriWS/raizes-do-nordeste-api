import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function criarUsuario(nome: string, email: string, senha: string, role: Role) {
  const senhaHash = await bcrypt.hash(senha, 10);

  return prisma.usuario.upsert({
    where: { email },
    update: { nome, senhaHash, role, ativo: true },
    create: { nome, email, senhaHash, role, ativo: true }
  });
}

async function main() {
  const admin = await criarUsuario('Administrador', 'admin@raizes.com', 'Admin@123', 'ADMIN');
  await criarUsuario('Gerente', 'gerente@raizes.com', 'Gerente@123', 'GERENTE');
  await criarUsuario('Cozinha', 'cozinha@raizes.com', 'Cozinha@123', 'COZINHA');
  await criarUsuario('Atendente', 'atendente@raizes.com', 'Atendente@123', 'ATENDENTE');
  const usuarioCliente = await criarUsuario('Cliente Demo', 'cliente@raizes.com', 'Cliente@123', 'CLIENTE');

  const cliente = await prisma.cliente.upsert({
    where: { usuarioId: usuarioCliente.id },
    update: {
      telefone: '85999990000',
      cpf: '12345678901',
      consentimentoFidelidade: true,
      dataConsentimento: new Date()
    },
    create: {
      usuarioId: usuarioCliente.id,
      telefone: '85999990000',
      cpf: '12345678901',
      consentimentoFidelidade: true,
      dataConsentimento: new Date()
    }
  });

  const matriz = await prisma.unidade.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'Raizes Matriz',
      cidade: 'Fortaleza',
      endereco: 'Av. Beira Mar, 1000',
      ativa: true
    }
  });

  const campus = await prisma.unidade.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: 'Raizes Campus',
      cidade: 'Natal',
      endereco: 'Rua das Palmeiras, 250',
      ativa: true
    }
  });

  const produtos = await Promise.all([
    prisma.produto.upsert({
      where: { id: 1 },
      update: {},
      create: { nome: 'Cuscuz com queijo', descricao: 'Cuscuz nordestino com queijo coalho.', preco: 12.5, ativo: true }
    }),
    prisma.produto.upsert({
      where: { id: 2 },
      update: {},
      create: { nome: 'Tapioca de frango', descricao: 'Tapioca recheada com frango temperado.', preco: 15, ativo: true }
    }),
    prisma.produto.upsert({
      where: { id: 3 },
      update: {},
      create: { nome: 'Bolo de rolo', descricao: 'Fatia individual de bolo de rolo.', preco: 8, ativo: true }
    }),
    prisma.produto.upsert({
      where: { id: 4 },
      update: {},
      create: { nome: 'Suco de cajá', descricao: 'Suco natural de caja.', preco: 7.5, ativo: true }
    }),
    prisma.produto.upsert({
      where: { id: 5 },
      update: {},
      create: { nome: 'Combo regional', descricao: 'Cuscuz, suco e sobremesa.', preco: 25, ativo: true }
    })
  ]);

  for (const unidade of [matriz, campus]) {
    for (const produto of produtos) {
      await prisma.cardapioUnidade.upsert({
        where: { unidadeId_produtoId: { unidadeId: unidade.id, produtoId: produto.id } },
        update: { disponivel: true },
        create: { unidadeId: unidade.id, produtoId: produto.id, disponivel: true }
      });

      await prisma.estoque.upsert({
        where: { unidadeId_produtoId: { unidadeId: unidade.id, produtoId: produto.id } },
        update: { quantidadeAtual: 50, quantidadeMinima: 5 },
        create: { unidadeId: unidade.id, produtoId: produto.id, quantidadeAtual: 50, quantidadeMinima: 5 }
      });
    }
  }

  await prisma.fidelidade.upsert({
    where: { clienteId: cliente.id },
    update: { saldoPontos: 25 },
    create: { clienteId: cliente.id, saldoPontos: 25 }
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: admin.id,
      acao: 'SEED_INICIAL',
      recurso: 'sistema',
      detalhes: { mensagem: 'Dados iniciais carregados para demonstração.' }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
