import { Module } from '@nestjs/common';
import { PedidosController } from './api/pedidos.controller';
import { PedidosService } from './application/pedidos.service';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService]
})
export class PedidosModule {}
