import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Cuscuz com queijo' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Cuscuz nordestino com queijo coalho.' })
  @IsString()
  descricao: string;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
