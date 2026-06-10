import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'cliente@raizes.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Cliente@123' })
  @IsString()
  @MinLength(6)
  senha: string;
}
