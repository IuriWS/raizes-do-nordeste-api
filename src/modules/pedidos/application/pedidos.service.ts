import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CanalPedido, FormaPagamento, PagamentoStatus, PedidoStatus, Prisma, Role, TipoMovimentoEstoque } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../common/decorators/current-user.decorator';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from '../dto/update-pedido-status.dto';

const STATUS_MANUAIS: PedidoStatus[] = [
  PedidoStatus.EM_PREPARO,
  PedidoStatus.PRONTO,
  PedidoStatus.ENTREGUE,
  PedidoStatus.CANCELADO
];

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreatePedidoDto, user: AuthUser) {
    if (dto.formaPagamento !== FormaPagamento.MOCK) {
      throw new BadRequestException('Apenas pagamento MOCK é permitido neste MVP.');
    }

    const clienteId = await this.resolveClienteId(dto, user);
    const unidade = await this.prisma.unidade.findUnique({ where: { id: dto.unidadeId } });

    if (!unidade || !unidade.ativa) {
      throw new NotFoundException('Unidade não encontrada ou inativa.');
    }

    const produtoIds = dto.itens.map((item) => item.produtoId);
    // O cardápio da unidade define se o produto pode ser vendido naquele canal.
    const cardapios = await this.prisma.cardapioUnidade.findMany({
      where: { unidadeId: dto.unidadeId, produtoId: { in: produtoIds }, disponivel: true },
      include: { produto: true }
    });

    if (cardapios.length !== produtoIds.length) {
      throw new NotFoundException('Um ou mais produtos não existem no cardápio da unidade.');
    }

    const estoques = await this.prisma.estoque.findMany({
      where: { unidadeId: dto.unidadeId, produtoId: { in: produtoIds } }
    });

    const linhas = dto.itens.map((item) => {
      const cardapio = cardapios.find((entrada) => entrada.produtoId === item.produtoId);
      const estoque = estoques.find((entrada) => entrada.produtoId === item.produtoId);

      if (!cardapio || !estoque) {
        throw new NotFoundException('Produto sem cardápio ou estoque na unidade.');
      }

      if (estoque.quantidadeAtual < item.quantidade) {
        throw new ConflictException('Estoque insuficiente.');
      }

      const precoUnitario = Number(cardapio.precoCustomizado ?? cardapio.produto.preco);
      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal: precoUnitario * item.quantidade,
        estoqueId: estoque.id
      };
    });

    const total = linhas.reduce((sum, item) => sum + item.subtotal, 0);

    // Pedido, pagamento pendente e reserva de estoque nascem juntos para manter consistência.
    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId,
          unidadeId: dto.unidadeId,
          canalPedido: dto.canalPedido,
          status: PedidoStatus.AGUARDANDO_PAGAMENTO,
          total,
          itens: {
            create: linhas.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
              subtotal: item.subtotal
            }))
          },
          pagamento: {
            create: {
              formaPagamento: dto.formaPagamento,
              status: PagamentoStatus.PENDENTE,
              valor: total,
              payloadEnvio: { canalPedido: dto.canalPedido, itens: dto.itens } as unknown as Prisma.InputJsonValue
            }
          }
        },
        include: { itens: true, pagamento: true }
      });

      // A reserva de estoque acontece junto com o pedido para evitar venda duplicada.
      for (const item of linhas) {
        await tx.estoque.update({
          where: { id: item.estoqueId },
          data: { quantidadeAtual: { decrement: item.quantidade } }
        });

        await tx.movimentoEstoque.create({
          data: {
            unidadeId: dto.unidadeId,
            produtoId: item.produtoId,
            tipoMovimento: TipoMovimentoEstoque.SAIDA,
            quantidade: item.quantidade,
            motivo: `Reserva do pedido ${pedido.id}`
          }
        });
      }

      await tx.auditoria.create({
        data: {
          usuarioId: user.sub,
          acao: 'PEDIDO_CRIADO',
          recurso: 'pedidos',
          recursoId: String(pedido.id),
          detalhes: { canalPedido: dto.canalPedido, total }
        }
      });

      return pedido;
    });
  }

  listar(user: AuthUser, canalPedido?: CanalPedido) {
    const where: any = {};

    if (canalPedido) {
      where.canalPedido = canalPedido;
    }

    if (user.role === Role.CLIENTE) {
      where.cliente = { usuarioId: user.sub };
    }

    return this.prisma.pedido.findMany({
      where,
      include: {
        itens: { include: { produto: true } },
        pagamento: true,
        cliente: {
          select: {
            id: true,
            usuarioId: true,
            telefone: true,
            cpf: true,
            consentimentoFidelidade: true,
            dataConsentimento: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true
              }
            }
          }
        }
      },
      orderBy: { id: 'desc' }
    });
  }

  async buscar(id: number, user: AuthUser) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: { include: { produto: true } }, pagamento: true, cliente: true }
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    if (user.role === Role.CLIENTE && pedido.cliente.usuarioId !== user.sub) {
      throw new ForbiddenException('Cliente só pode consultar os próprios pedidos.');
    }

    return pedido;
  }

  async atualizarStatus(id: number, dto: UpdatePedidoStatusDto, user: AuthUser) {
    if (!STATUS_MANUAIS.includes(dto.status)) {
      throw new BadRequestException('Status não permitido para atualização manual.');
    }

    const pedido = await this.buscar(id, user);
    this.validarTransicao(pedido.status, dto.status);

    const atualizado = await this.prisma.pedido.update({
      where: { id },
      data: { status: dto.status }
    });

    await this.prisma.auditoria.create({
      data: {
        usuarioId: user.sub,
        acao: 'PEDIDO_STATUS_ATUALIZADO',
        recurso: 'pedidos',
        recursoId: String(id),
        detalhes: { de: pedido.status, para: dto.status }
      }
    });

    return atualizado;
  }

  async cancelar(id: number, user: AuthUser) {
    const pedido = await this.buscar(id, user);

    const statusFinais: PedidoStatus[] = [PedidoStatus.ENTREGUE, PedidoStatus.CANCELADO];
    if (statusFinais.includes(pedido.status)) {
      throw new ConflictException('Pedido não pode ser cancelado neste status.');
    }

    const statusComReserva: PedidoStatus[] = [
      PedidoStatus.AGUARDANDO_PAGAMENTO,
      PedidoStatus.PAGO,
      PedidoStatus.EM_PREPARO,
      PedidoStatus.PRONTO
    ];
    const deveRestaurarEstoque = statusComReserva.includes(pedido.status);

    return this.prisma.$transaction(async (tx) => {
      const cancelado = await tx.pedido.update({
        where: { id },
        data: { status: PedidoStatus.CANCELADO }
      });

      // O estoque foi reservado na criação do pedido e precisa voltar se o pedido não foi concluído.
      if (deveRestaurarEstoque) {
        for (const item of pedido.itens) {
          await tx.estoque.update({
            where: { unidadeId_produtoId: { unidadeId: pedido.unidadeId, produtoId: item.produtoId } },
            data: { quantidadeAtual: { increment: item.quantidade } }
          });

          await tx.movimentoEstoque.create({
            data: {
              unidadeId: pedido.unidadeId,
              produtoId: item.produtoId,
              tipoMovimento: TipoMovimentoEstoque.ESTORNO,
              quantidade: item.quantidade,
              motivo: `Cancelamento do pedido ${id}`
            }
          });
        }
      }

      await tx.auditoria.create({
        data: {
          usuarioId: user.sub,
          acao: 'PEDIDO_CANCELADO',
          recurso: 'pedidos',
          recursoId: String(id),
          detalhes: { statusAnterior: pedido.status, estoqueRestaurado: deveRestaurarEstoque }
        }
      });

      return cancelado;
    });
  }

  private async resolveClienteId(dto: CreatePedidoDto, user: AuthUser) {
    if (user.role === Role.CLIENTE) {
      const cliente = await this.prisma.cliente.findUnique({ where: { usuarioId: user.sub } });
      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado para usuário autenticado.');
      }
      return cliente.id;
    }

    if (!dto.clienteId) {
      throw new BadRequestException('clienteId é obrigatório para perfis operacionais.');
    }

    const cliente = await this.prisma.cliente.findUnique({ where: { id: dto.clienteId } });
    if (!cliente) {
      throw new NotFoundException('Cliente informado não encontrado.');
    }

    return cliente.id;
  }

  private validarTransicao(atual: PedidoStatus, proximo: PedidoStatus) {
    // Transicoes fechadas evitam voltar pedido finalizado ou pular etapas operacionais.
    const permitidas: Record<PedidoStatus, PedidoStatus[]> = {
      AGUARDANDO_PAGAMENTO: [PedidoStatus.CANCELADO],
      PAGO: [PedidoStatus.EM_PREPARO, PedidoStatus.CANCELADO],
      PAGAMENTO_RECUSADO: [],
      EM_PREPARO: [PedidoStatus.PRONTO, PedidoStatus.CANCELADO],
      PRONTO: [PedidoStatus.ENTREGUE],
      ENTREGUE: [],
      CANCELADO: []
    };

    if (!permitidas[atual].includes(proximo)) {
      throw new ConflictException('Transicao de status invalida.');
    }
  }
}
