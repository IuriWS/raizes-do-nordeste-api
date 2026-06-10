import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { EstoqueService } from '../application/estoque.service';
import { CreateMovimentoEstoqueDto } from '../dto/create-movimento-estoque.dto';

@ApiBearerAuth()
@ApiTags('Estoque')
@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Roles(Role.ADMIN, Role.GERENTE, Role.ATENDENTE)
  @Get()
  listar(@Query('unidadeId', ParseIntPipe) unidadeId: number) {
    return this.estoqueService.listarPorUnidade(unidadeId);
  }

  @Roles(Role.ADMIN, Role.GERENTE)
  @Post('movimentos')
  movimentar(@Body() dto: CreateMovimentoEstoqueDto, @CurrentUser() user: AuthUser) {
    return this.estoqueService.movimentar(dto, user.sub);
  }

  @Roles(Role.ADMIN, Role.GERENTE, Role.ATENDENTE)
  @Get(':unidadeId/:produtoId')
  buscar(
    @Param('unidadeId', ParseIntPipe) unidadeId: number,
    @Param('produtoId', ParseIntPipe) produtoId: number
  ) {
    return this.estoqueService.buscar(unidadeId, produtoId);
  }
}
