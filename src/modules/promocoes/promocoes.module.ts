import { Module } from '@nestjs/common';
import { PromocoesController } from './api/promocoes.controller';
import { PromocoesService } from './application/promocoes.service';

@Module({
  controllers: [PromocoesController],
  providers: [PromocoesService]
})
export class PromocoesModule {}
