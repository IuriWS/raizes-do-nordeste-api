import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.auditoria.findMany({
      include: { usuario: { select: { id: true, nome: true, email: true, role: true } } },
      orderBy: { id: 'desc' },
      take: 100
    });
  }
}
