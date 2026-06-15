import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  criar(dto: CreateProdutoDto) {
    return this.prisma.produto.create({ data: { ...dto, ativo: dto.ativo ?? true } });
  }

  listar() {
    return this.prisma.produto.findMany({ orderBy: { id: 'asc' } });
  }

  async buscar(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado.');
    }
    return produto;
  }

  async atualizar(id: number, dto: UpdateProdutoDto) {
    await this.buscar(id);
    return this.prisma.produto.update({ where: { id }, data: dto });
  }
}
