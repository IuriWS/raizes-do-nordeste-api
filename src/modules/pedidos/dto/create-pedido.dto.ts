import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CanalPedido, FormaPagamento } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, ValidateNested, Min } from 'class-validator';

export class CreatePedidoItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  produtoId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CreatePedidoDto {
  @ApiPropertyOptional({ example: 1, description: 'Obrigatório para ADMIN, GERENTE ou ATENDENTE criarem pedido para cliente.' })
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  unidadeId: number;

  @ApiProperty({ enum: CanalPedido, example: CanalPedido.TOTEM })
  @IsEnum(CanalPedido)
  canalPedido: CanalPedido;

  @ApiProperty({ enum: FormaPagamento, example: FormaPagamento.MOCK })
  @IsEnum(FormaPagamento)
  formaPagamento: FormaPagamento;

  @ApiProperty({ type: [CreatePedidoItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  itens: CreatePedidoItemDto[];
}
