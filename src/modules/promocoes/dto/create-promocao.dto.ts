import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePromocaoDto {
  @ApiProperty({ example: 'Combo do almoço' })
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'Desconto em combos regionais durante a semana.' })
  @IsString()
  descricao: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @ApiProperty({ example: '2026-02-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  dataInicio: Date;

  @ApiProperty({ example: '2026-02-28T23:59:59.000Z' })
  @Type(() => Date)
  @IsDate()
  dataFim: Date;
}
