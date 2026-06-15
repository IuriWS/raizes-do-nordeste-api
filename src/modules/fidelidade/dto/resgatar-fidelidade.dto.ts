import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ResgatarFidelidadeDto {
  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  pontos: number;
}
