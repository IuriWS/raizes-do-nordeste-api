import { Module } from '@nestjs/common';
import { FidelidadeController } from './api/fidelidade.controller';
import { FidelidadeService } from './application/fidelidade.service';

@Module({
  controllers: [FidelidadeController],
  providers: [FidelidadeService]
})
export class FidelidadeModule {}
