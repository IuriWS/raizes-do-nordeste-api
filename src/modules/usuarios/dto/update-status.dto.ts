import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUsuarioStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  ativo: boolean;
}
