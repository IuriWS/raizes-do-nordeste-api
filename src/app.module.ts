import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { AuthModule } from './modules/auth/auth.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { FidelidadeModule } from './modules/fidelidade/fidelidade.module';
import { PagamentosModule } from './modules/pagamentos/pagamentos.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { PromocoesModule } from './modules/promocoes/promocoes.module';
import { RolesGuard } from './common/guards/roles.guard';
import { UnidadesModule } from './modules/unidades/unidades.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as any }
    }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    UnidadesModule,
    ProdutosModule,
    EstoqueModule,
    PedidosModule,
    PagamentosModule,
    FidelidadeModule,
    PromocoesModule,
    AuditoriaModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ]
})
export class AppModule {}
