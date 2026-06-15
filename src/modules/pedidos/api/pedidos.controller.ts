import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { CanalPedido, Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  erroNaoAutorizadoExample,
  erroSemPermissaoExample,
  erroValidacaoExample,
  pedidoResponseExample
} from '../../../common/swagger/api-examples';
import { PedidosService } from '../application/pedidos.service';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from '../dto/update-pedido-status.dto';

@ApiBearerAuth()
@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Roles(Role.ADMIN, Role.GERENTE, Role.ATENDENTE, Role.CLIENTE)
  @ApiOperation({ summary: 'Cria pedido multicanal e reserva estoque.' })
  @ApiCreatedResponse({ description: 'Pedido criado com pagamento pendente.', schema: { example: pedidoResponseExample } })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.', schema: { example: erroNaoAutorizadoExample } })
  @ApiForbiddenResponse({ description: 'Perfil sem permissão.', schema: { example: erroSemPermissaoExample } })
  @ApiNotFoundResponse({ description: 'Unidade, cardápio ou cliente não encontrado.' })
  @ApiConflictResponse({ description: 'Estoque insuficiente.' })
  @ApiUnprocessableEntityResponse({ description: 'Payload inválido.', schema: { example: erroValidacaoExample } })
  @Post()
  criar(@Body() dto: CreatePedidoDto, @CurrentUser() user: AuthUser) {
    return this.pedidosService.criar(dto, user);
  }

  @Roles(Role.ADMIN, Role.GERENTE, Role.COZINHA, Role.ATENDENTE, Role.CLIENTE)
  @ApiOperation({ summary: 'Lista pedidos e permite filtro por canal.' })
  @ApiQuery({ name: 'canalPedido', enum: CanalPedido, required: false })
  @ApiOkResponse({ description: 'Lista de pedidos.', schema: { example: [pedidoResponseExample] } })
  @Get()
  listar(@CurrentUser() user: AuthUser, @Query('canalPedido') canalPedido?: CanalPedido) {
    return this.pedidosService.listar(user, canalPedido);
  }

  @Roles(Role.ADMIN, Role.GERENTE, Role.COZINHA, Role.ATENDENTE, Role.CLIENTE)
  @ApiOperation({ summary: 'Consulta pedido por identificador.' })
  @ApiOkResponse({ description: 'Pedido encontrado.', schema: { example: pedidoResponseExample } })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado.' })
  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.pedidosService.buscar(id, user);
  }

  @Roles(Role.ADMIN, Role.GERENTE, Role.COZINHA)
  @ApiOperation({ summary: 'Atualiza status operacional do pedido.' })
  @ApiOkResponse({ description: 'Status atualizado.', schema: { example: { ...pedidoResponseExample, status: 'EM_PREPARO' } } })
  @ApiConflictResponse({ description: 'Transicao de status invalida.' })
  @Patch(':id/status')
  atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePedidoStatusDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.pedidosService.atualizarStatus(id, dto, user);
  }

  @Roles(Role.ADMIN, Role.GERENTE, Role.ATENDENTE, Role.CLIENTE)
  @ApiOperation({ summary: 'Cancela pedido quando o status permite.' })
  @ApiOkResponse({ description: 'Pedido cancelado.', schema: { example: { ...pedidoResponseExample, status: 'CANCELADO' } } })
  @ApiConflictResponse({ description: 'Pedido não pode ser cancelado neste status.' })
  @Delete(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.pedidosService.cancelar(id, user);
  }
}
