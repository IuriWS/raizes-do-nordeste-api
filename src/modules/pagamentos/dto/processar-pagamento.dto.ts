import { ApiProperty } from '@nestjs/swagger';
import { PagamentoStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ProcessarPagamentoMockDto {
  @ApiProperty({ enum: [PagamentoStatus.APROVADO, PagamentoStatus.RECUSADO], example: PagamentoStatus.APROVADO })
  @IsEnum(PagamentoStatus)
  resultado: PagamentoStatus;
}
