import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ProdutosService } from '../application/produtos.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@ApiBearerAuth()
@ApiTags('Produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Roles(Role.ADMIN, Role.GERENTE)
  @Post()
  criar(@Body() dto: CreateProdutoDto) {
    return this.produtosService.criar(dto);
  }

  @Get()
  listar() {
    return this.produtosService.listar();
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.buscar(id);
  }

  @Roles(Role.ADMIN, Role.GERENTE)
  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoDto) {
    return this.produtosService.atualizar(id, dto);
  }
}
