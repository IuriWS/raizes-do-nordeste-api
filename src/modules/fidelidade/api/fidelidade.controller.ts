import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { FidelidadeService } from '../application/fidelidade.service';
import { ResgatarFidelidadeDto } from '../dto/resgatar-fidelidade.dto';

@ApiBearerAuth()
@ApiTags('Fidelidade')
@Roles(Role.CLIENTE)
@Controller('fidelidade')
export class FidelidadeController {
  constructor(private readonly fidelidadeService: FidelidadeService) {}

  @Get('saldo')
  saldo(@CurrentUser() user: AuthUser) {
    return this.fidelidadeService.saldo(user);
  }

  @Get('historico')
  historico(@CurrentUser() user: AuthUser) {
    return this.fidelidadeService.historico(user);
  }

  @Post('resgatar')
  resgatar(@Body() dto: ResgatarFidelidadeDto, @CurrentUser() user: AuthUser) {
    return this.fidelidadeService.resgatar(dto, user);
  }
}
