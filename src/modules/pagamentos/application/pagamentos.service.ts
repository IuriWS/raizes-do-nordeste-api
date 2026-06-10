import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PagamentoStatus, PedidoStatus, Role, TipoMovimentoEstoque, TipoMovimentoFidelidade } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AuthUser } from '../../../common/decorators/current-user.decorator';
import { calcularPontosPedido } from '../../fidelidade/domain/fidelidade.rules';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProcessarPagamentoMockDto } from '../dto/processar-pagamento.dto';

@Injectable()
export class PagamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async processarMock(pedidoId: number, dto: ProcessarPagamentoMockDto, user: AuthUser) {
    const resultadosPermitidos: PagamentoStatus[] = [PagamentoStatus.APROVADO, PagamentoStatus.RECUSADO];
    if (!resultadosPermitidos.includes(dto.resultado)) {
      throw new BadRequestException('Resultado deve ser APROVADO ou RECUSADO.');
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { pagamento: true, itens: true, cliente: true }
    });

    if (!pedido || !pedido.pagamento) {
      throw new NotFoundException('Pedido ou pagamento nao encontrado.');
    }

    this.validarPosseCliente(pedido.cliente.usuarioId, user);

    if (pedido.status !== PedidoStatus.AGUARDANDO_PAGAMENTO) {
      throw new ConflictException('Pedido nao aceita pagamento neste status.');
    }

    // Pagamento mock e processado uma unica vez para evitar duplo credito ou duplo estorno.
    if (pedido.pagamento.status !== PagamentoStatus.PENDENTE) {
      throw new ConflictException('Pagamento ja processado.');
    }

    return this.prisma.$transaction(async (tx) => {
      const providerMockId = `mock_${randomUUID()}`;
      const aprovado = dto.resultado === PagamentoStatus.APROVADO;

      const pagamento = await tx.pagamento.update({
        where: { pedidoId },
        data: {
          status: dto.resultado,
          providerMockId,
          payloadRetorno: { resultado: dto.resultado, providerMockId }
        }
      });

      const statusPedido = aprovado ? PedidoStatus.PAGO : PedidoStatus.PAGAMENTO_RECUSADO;
      const pedidoAtualizado = await tx.pedido.update({
        where: { id: pedidoId },
        data: { status: statusPedido },
        include: { itens: true, pagamento: true }
      });

      // Pontos so sao creditados quando o pagamento fecha e o cliente aceitou fidelidade.
      if (aprovado && pedido.cliente.consentimentoFidelidade) {
        const pontos = calcularPontosPedido(Number(pedido.total));

        await tx.fidelidade.upsert({
          where: { clienteId: pedido.clienteId },
          update: { saldoPontos: { increment: pontos } },
          create: { clienteId: pedido.clienteId, saldoPontos: pontos }
        });

        await tx.movimentoFidelidade.create({
          data: {
            clienteId: pedido.clienteId,
            tipo: TipoMovimentoFidelidade.CREDITO,
            pontos,
            motivo: `Pedido ${pedidoId} pago`,
            pedidoId
          }
        });
      }

      if (!aprovado) {
        // Se o pagamento falha, a reserva feita na criacao do pedido volta para o estoque.
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
              motivo: `Pagamento recusado do pedido ${pedidoId}`
            }
          });
        }
      }

      await tx.auditoria.create({
        data: {
          usuarioId: user.sub,
          acao: aprovado ? 'PAGAMENTO_APROVADO' : 'PAGAMENTO_RECUSADO',
          recurso: 'pagamentos',
          recursoId: String(pagamento.id),
          detalhes: { pedidoId, providerMockId, resultado: dto.resultado }
        }
      });

      return pedidoAtualizado;
    });
  }

  async buscarPorPedido(pedidoId: number, user: AuthUser) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { pedidoId },
      include: { pedido: { include: { cliente: true } } }
    });
    if (!pagamento) {
      throw new NotFoundException('Pagamento nao encontrado.');
    }
    this.validarPosseCliente(pagamento.pedido.cliente.usuarioId, user);
    return pagamento;
  }

  private validarPosseCliente(usuarioId: number, user: AuthUser) {
    if (user.role === Role.CLIENTE && usuarioId !== user.sub) {
      throw new ForbiddenException('Cliente so pode acessar pagamento dos proprios pedidos.');
    }
  }
}
