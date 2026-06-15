import { Module } from '@nestjs/common';
import { PagamentosController } from './api/pagamentos.controller';
import { PagamentosService } from './application/pagamentos.service';

@Module({
  controllers: [PagamentosController],
  providers: [PagamentosService]
})
export class PagamentosModule {}
