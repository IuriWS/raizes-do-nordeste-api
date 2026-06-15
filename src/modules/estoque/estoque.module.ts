import { Module } from '@nestjs/common';
import { EstoqueController } from './api/estoque.controller';
import { EstoqueService } from './application/estoque.service';

@Module({
  controllers: [EstoqueController],
  providers: [EstoqueService],
  exports: [EstoqueService]
})
export class EstoqueModule {}
