import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, TipoMovimentoFidelidade } from '@prisma/client';
import { AuthUser } from '../../../common/decorators/current-user.decorator';
import { PrismaService } from '../../../prisma/prisma.service';
import { calcularDescontoConceitual, podeResgatar } from '../domain/fidelidade.rules';
import { ResgatarFidelidadeDto } from '../dto/resgatar-fidelidade.dto';

@Injectable()
export class FidelidadeService {
  constructor(private readonly prisma: PrismaService) {}

  async saldo(user: AuthUser) {
    const cliente = await this.resolveCliente(user);
    // Upsert garante que clientes antigos tambem tenham registro de fidelidade.
    const fidelidade = await this.prisma.fidelidade.upsert({
      where: { clienteId: cliente.id },
      update: {},
      create: { clienteId: cliente.id, saldoPontos: 0 }
    });

    return {
      clienteId: cliente.id,
      saldoPontos: fidelidade.saldoPontos,
      descontoConceitual: calcularDescontoConceitual(fidelidade.saldoPontos)
    };
  }

  async historico(user: AuthUser) {
    const cliente = await this.resolveCliente(user);
    return this.prisma.movimentoFidelidade.findMany({
      where: { clienteId: cliente.id },
      orderBy: { id: 'desc' }
    });
  }

  async resgatar(dto: ResgatarFidelidadeDto, user: AuthUser) {
    const cliente = await this.resolveCliente(user);
    const fidelidade = await this.prisma.fidelidade.findUnique({ where: { clienteId: cliente.id } });

    if (!fidelidade || !podeResgatar(fidelidade.saldoPontos, dto.pontos)) {
      throw new ConflictException('Saldo insuficiente para resgate.');
    }

    // Resgate reduz o saldo e cria histórico para auditoria funcional do cliente.
    return this.prisma.$transaction(async (tx) => {
      const atualizado = await tx.fidelidade.update({
        where: { clienteId: cliente.id },
        data: { saldoPontos: { decrement: dto.pontos } }
      });

      await tx.movimentoFidelidade.create({
        data: {
          clienteId: cliente.id,
          tipo: TipoMovimentoFidelidade.DEBITO,
          pontos: dto.pontos,
          motivo: `Resgate conceitual de R$ ${calcularDescontoConceitual(dto.pontos)},00`
        }
      });

      await tx.auditoria.create({
        data: {
          usuarioId: user.sub,
          acao: 'FIDELIDADE_RESGATADA',
          recurso: 'fidelidade',
          recursoId: String(cliente.id),
          detalhes: { pontos: dto.pontos }
        }
      });

      return atualizado;
    });
  }

  private async resolveCliente(user: AuthUser) {
    if (user.role !== Role.CLIENTE) {
      throw new ConflictException('Endpoint de fidelidade usa o cliente autenticado.');
    }

    const cliente = await this.prisma.cliente.findUnique({ where: { usuarioId: user.sub } });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }
    return cliente;
  }
}
