import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUnidadeDto {
  @ApiProperty({ example: 'Raizes Campus' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Natal' })
  @IsString()
  cidade: string;

  @ApiProperty({ example: 'Rua das Palmeiras, 250' })
  @IsString()
  endereco: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}
