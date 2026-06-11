import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { PromocoesService } from '../application/promocoes.service';
import { CreatePromocaoDto } from '../dto/create-promocao.dto';
import { UpdatePromocaoDto } from '../dto/update-promocao.dto';

@ApiBearerAuth()
@ApiTags('Promoções')
@Controller('promocoes')
export class PromocoesController {
  constructor(private readonly promocoesService: PromocoesService) {}

  @Roles(Role.ADMIN, Role.GERENTE)
  @Post()
  criar(@Body() dto: CreatePromocaoDto) {
    return this.promocoesService.criar(dto);
  }

  @Get()
  listar() {
    return this.promocoesService.listar();
  }

  @Roles(Role.ADMIN, Role.GERENTE)
  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePromocaoDto) {
    return this.promocoesService.atualizar(id, dto);
  }
}
