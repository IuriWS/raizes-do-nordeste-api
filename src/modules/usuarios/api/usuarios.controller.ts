import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, AuthUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UsuariosService } from '../application/usuarios.service';
import { UpdateUsuarioStatusDto } from '../dto/update-status.dto';

@ApiBearerAuth()
@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.usuariosService.me(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get()
  listar() {
    return this.usuariosService.listar();
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioStatusDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.usuariosService.atualizarStatus(id, dto.ativo, user.sub);
  }
}
