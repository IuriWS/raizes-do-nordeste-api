import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Maria Cliente' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'maria@raizes.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Maria@123' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiPropertyOptional({ example: '85988887777' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: '12345678901' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  consentimentoFidelidade?: boolean;
}
