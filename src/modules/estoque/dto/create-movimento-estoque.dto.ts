import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimentoEstoque } from '@prisma/client';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export class CreateMovimentoEstoqueDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  unidadeId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  produtoId: number;

  @ApiProperty({ enum: TipoMovimentoEstoque, example: TipoMovimentoEstoque.ENTRADA })
  @IsEnum(TipoMovimentoEstoque)
  tipoMovimento: TipoMovimentoEstoque;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  quantidade: number;

  @ApiProperty({ example: 'Reposicao manual' })
  @IsString()
  motivo: string;
}
