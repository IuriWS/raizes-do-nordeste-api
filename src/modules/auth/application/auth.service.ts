import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { cliente: true }
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Email ou senha invalidos.');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha invalidos.');
    }

    // O token carrega apenas dados necessarios para autorizacao nos guards.
    const payload = { sub: usuario.id, email: usuario.email, role: usuario.role };

    // Login e uma acao sensivel, por isso fica registrado para rastreabilidade.
    await this.prisma.auditoria.create({
      data: {
        usuarioId: usuario.id,
        acao: 'LOGIN',
        recurso: 'auth',
        detalhes: { email: usuario.email }
      }
    });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      usuario: this.sanitize(usuario)
    };
  }

  async register(dto: RegisterDto) {
    const emailExistente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (emailExistente) {
      throw new ConflictException('Email ja cadastrado.');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    // Cliente recebe cadastro complementar e saldo inicial dentro da mesma transacao.
    const usuario = await this.prisma.$transaction(async (tx) => {
      const novoUsuario = await tx.usuario.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          senhaHash,
          role: Role.CLIENTE,
          ativo: true
        }
      });

      const cliente = await tx.cliente.create({
        data: {
          usuarioId: novoUsuario.id,
          telefone: dto.telefone ?? '',
          cpf: dto.cpf,
          consentimentoFidelidade: dto.consentimentoFidelidade ?? false,
          dataConsentimento: dto.consentimentoFidelidade ? new Date() : undefined
        }
      });

      await tx.fidelidade.create({ data: { clienteId: cliente.id, saldoPontos: 0 } });

      await tx.auditoria.create({
        data: {
          usuarioId: novoUsuario.id,
          acao: 'USUARIO_REGISTRADO',
          recurso: 'usuarios',
          recursoId: String(novoUsuario.id),
          detalhes: { role: Role.CLIENTE }
        }
      });

      return novoUsuario;
    });

    return this.sanitize(usuario);
  }

  sanitize(usuario: Usuario) {
    const { senhaHash, ...safe } = usuario;
    return safe;
  }
}
