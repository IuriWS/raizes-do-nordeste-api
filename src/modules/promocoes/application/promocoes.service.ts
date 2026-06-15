import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePromocaoDto } from '../dto/create-promocao.dto';
import { UpdatePromocaoDto } from '../dto/update-promocao.dto';

@Injectable()
export class PromocoesService {
  constructor(private readonly prisma: PrismaService) {}

  criar(dto: CreatePromocaoDto) {
    return this.prisma.promocao.create({ data: { ...dto, ativa: dto.ativa ?? true } });
  }

  listar() {
    return this.prisma.promocao.findMany({ orderBy: { id: 'desc' } });
  }

  async atualizar(id: number, dto: UpdatePromocaoDto) {
    const promocao = await this.prisma.promocao.findUnique({ where: { id } });
    if (!promocao) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    return this.prisma.promocao.update({ where: { id }, data: dto });
  }
}
