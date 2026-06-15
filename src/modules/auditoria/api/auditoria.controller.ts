import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AuditoriaService } from '../application/auditoria.service';

@ApiBearerAuth()
@ApiTags('Auditoria')
@Roles(Role.ADMIN, Role.GERENTE)
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  listar() {
    return this.auditoriaService.listar();
  }
}
