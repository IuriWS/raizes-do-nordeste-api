import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async me(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { cliente: true }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.sanitize(usuario);
  }

  async listar() {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      include: { cliente: true }
    });

    return usuarios.map((usuario) => this.sanitize(usuario));
  }

  async atualizarStatus(id: number, ativo: boolean, usuarioLogadoId: number) {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { ativo }
    });

    await this.prisma.auditoria.create({
      data: {
        usuarioId: usuarioLogadoId,
        acao: 'USUARIO_STATUS_ATUALIZADO',
        recurso: 'usuarios',
        recursoId: String(id),
        detalhes: { ativo }
      }
    });

    return this.sanitize(usuario);
  }

  private sanitize(usuario: any) {
    const { senhaHash, ...safe } = usuario;
    return safe;
  }
}
