import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TipoMovimentoEstoque } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMovimentoEstoqueDto } from '../dto/create-movimento-estoque.dto';

@Injectable()
export class EstoqueService {
  constructor(private readonly prisma: PrismaService) {}

  listarPorUnidade(unidadeId: number) {
    return this.prisma.estoque.findMany({
      where: { unidadeId },
      include: { produto: true, unidade: true },
      orderBy: { produtoId: 'asc' }
    });
  }

  async buscar(unidadeId: number, produtoId: number) {
    const estoque = await this.prisma.estoque.findUnique({
      where: { unidadeId_produtoId: { unidadeId, produtoId } },
      include: { produto: true, unidade: true }
    });

    if (!estoque) {
      throw new NotFoundException('Estoque não encontrado para unidade e produto.');
    }

    return estoque;
  }

  async movimentar(dto: CreateMovimentoEstoqueDto, usuarioId: number) {
    // A quantidade e o histórico de movimento precisam ser gravados juntos.
    return this.prisma.$transaction(async (tx) => {
      const estoque = await tx.estoque.findUnique({
        where: { unidadeId_produtoId: { unidadeId: dto.unidadeId, produtoId: dto.produtoId } }
      });

      if (!estoque) {
        throw new NotFoundException('Estoque não encontrado para unidade e produto.');
      }

      const delta = dto.tipoMovimento === TipoMovimentoEstoque.SAIDA ? -dto.quantidade : dto.quantidade;
      const novaQuantidade = estoque.quantidadeAtual + delta;

      // Saídas manuais não podem deixar o estoque negativo; isso evita vender item inexistente.
      if (novaQuantidade < 0) {
        throw new ConflictException('Estoque insuficiente.');
      }

      const atualizado = await tx.estoque.update({
        where: { id: estoque.id },
        data: { quantidadeAtual: novaQuantidade }
      });

      await tx.movimentoEstoque.create({
        data: {
          unidadeId: dto.unidadeId,
          produtoId: dto.produtoId,
          tipoMovimento: dto.tipoMovimento,
          quantidade: dto.quantidade,
          motivo: dto.motivo
        }
      });

      await tx.auditoria.create({
        data: {
          usuarioId,
          acao: 'ESTOQUE_MOVIMENTADO',
          recurso: 'estoque',
          recursoId: `${dto.unidadeId}:${dto.produtoId}`,
          detalhes: dto as unknown as Prisma.InputJsonValue
        }
      });

      return atualizado;
    });
  }
}
