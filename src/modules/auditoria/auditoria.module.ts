import { Module } from '@nestjs/common';
import { AuditoriaController } from './api/auditoria.controller';
import { AuditoriaService } from './application/auditoria.service';

@Module({
  controllers: [AuditoriaController],
  providers: [AuditoriaService]
})
export class AuditoriaModule {}
