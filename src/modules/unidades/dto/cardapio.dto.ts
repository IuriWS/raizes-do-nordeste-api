import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class AddCardapioItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  produtoId: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  disponivel?: boolean;

  @ApiProperty({ example: 13.9, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precoCustomizado?: number;
}
