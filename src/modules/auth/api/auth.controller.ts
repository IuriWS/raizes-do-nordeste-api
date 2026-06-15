import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { erroNaoAutorizadoExample, erroValidacaoExample, loginResponseExample } from '../../../common/swagger/api-examples';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Autentica usuário e retorna token JWT.' })
  @ApiOkResponse({ description: 'Login efetuado.', schema: { example: loginResponseExample } })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.', schema: { example: erroNaoAutorizadoExample } })
  @ApiUnprocessableEntityResponse({ description: 'Payload inválido.', schema: { example: erroValidacaoExample } })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Cria usuário e, quando aplicável, cadastro de cliente.' })
  @ApiCreatedResponse({ description: 'Usuário cadastrado.', schema: { example: loginResponseExample.usuario } })
  @ApiUnprocessableEntityResponse({ description: 'Payload inválido.', schema: { example: erroValidacaoExample } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
