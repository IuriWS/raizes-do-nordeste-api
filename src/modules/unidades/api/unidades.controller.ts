import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UnidadesService } from '../application/unidades.service';
import { AddCardapioItemDto } from '../dto/cardapio.dto';
import { CreateUnidadeDto } from '../dto/create-unidade.dto';
import { UpdateUnidadeDto } from '../dto/update-unidade.dto';

@ApiBearerAuth()
@ApiTags('Unidades')
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Roles(Role.ADMIN, Role.GERENTE)
  @Post()
  criar(@Body() dto: CreateUnidadeDto) {
    return this.unidadesService.criar(dto);
  }

  @Get()
  listar() {
    return this.unidadesService.listar();
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.buscar(id);
  }

  @Roles(Role.ADMIN, Role.GERENTE)
  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUnidadeDto) {
    return this.unidadesService.atualizar(id, dto);
  }

  @Get(':unidadeId/cardapio')
  listarCardapio(@Param('unidadeId', ParseIntPipe) unidadeId: number) {
    return this.unidadesService.listarCardapio(unidadeId);
  }

  @Roles(Role.ADMIN, Role.GERENTE)
  @Post(':unidadeId/cardapio')
  adicionarCardapio(
    @Param('unidadeId', ParseIntPipe) unidadeId: number,
    @Body() dto: AddCardapioItemDto
  ) {
    return this.unidadesService.adicionarCardapio(unidadeId, dto);
  }
}
