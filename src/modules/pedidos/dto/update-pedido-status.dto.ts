import { ApiProperty } from '@nestjs/swagger';
import { PedidoStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdatePedidoStatusDto {
  @ApiProperty({ enum: PedidoStatus, example: PedidoStatus.EM_PREPARO })
  @IsEnum(PedidoStatus)
  status: PedidoStatus;
}
