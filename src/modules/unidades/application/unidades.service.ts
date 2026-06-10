import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddCardapioItemDto } from '../dto/cardapio.dto';
import { CreateUnidadeDto } from '../dto/create-unidade.dto';
import { UpdateUnidadeDto } from '../dto/update-unidade.dto';

@Injectable()
export class UnidadesService {
  constructor(private readonly prisma: PrismaService) {}

  criar(dto: CreateUnidadeDto) {
    return this.prisma.unidade.create({ data: { ...dto, ativa: dto.ativa ?? true } });
  }

  listar() {
    return this.prisma.unidade.findMany({ orderBy: { id: 'asc' } });
  }

  async buscar(id: number) {
    const unidade = await this.prisma.unidade.findUnique({ where: { id } });
    if (!unidade) {
      throw new NotFoundException('Unidade nao encontrada.');
    }
    return unidade;
  }

  async atualizar(id: number, dto: UpdateUnidadeDto) {
    await this.buscar(id);
    return this.prisma.unidade.update({ where: { id }, data: dto });
  }

  async listarCardapio(unidadeId: number) {
    await this.buscar(unidadeId);

    return this.prisma.cardapioUnidade.findMany({
      where: { unidadeId },
      include: { produto: true },
      orderBy: { produtoId: 'asc' }
    });
  }

  async adicionarCardapio(unidadeId: number, dto: AddCardapioItemDto) {
    await this.buscar(unidadeId);
    const produto = await this.prisma.produto.findUnique({ where: { id: dto.produtoId } });

    if (!produto) {
      throw new NotFoundException('Produto nao encontrado.');
    }

    return this.prisma.cardapioUnidade.upsert({
      where: { unidadeId_produtoId: { unidadeId, produtoId: dto.produtoId } },
      update: {
        disponivel: dto.disponivel ?? true,
        precoCustomizado: dto.precoCustomizado
      },
      create: {
        unidadeId,
        produtoId: dto.produtoId,
        disponivel: dto.disponivel ?? true,
        precoCustomizado: dto.precoCustomizado
      },
      include: { produto: true }
    });
  }
}
