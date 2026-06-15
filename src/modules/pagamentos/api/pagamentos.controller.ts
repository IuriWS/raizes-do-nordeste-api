import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { erroValidacaoExample, pagamentoAprovadoResponseExample } from '../../../common/swagger/api-examples';
import { PagamentosService } from '../application/pagamentos.service';
import { ProcessarPagamentoMockDto } from '../dto/processar-pagamento.dto';

@ApiBearerAuth()
@ApiTags('Pagamentos')
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Roles(Role.ADMIN, Role.GERENTE, Role.ATENDENTE, Role.CLIENTE)
  @ApiOperation({ summary: 'Processa pagamento mock aprovado ou recusado.' })
  @ApiOkResponse({ description: 'Pagamento processado.', schema: { example: pagamentoAprovadoResponseExample } })
  @ApiNotFoundResponse({ description: 'Pedido ou pagamento não encontrado.' })
  @ApiConflictResponse({ description: 'Pagamento ja processado ou pedido fora do status permitido.' })
  @ApiUnprocessableEntityResponse({ description: 'Payload inválido.', schema: { example: erroValidacaoExample } })
  @HttpCode(200)
  @Post('mock/:pedidoId')
  processarMock(
    @Param('pedidoId', ParseIntPipe) pedidoId: number,
    @Body() dto: ProcessarPagamentoMockDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.pagamentosService.processarMock(pedidoId, dto, user);
  }

  @Roles(Role.ADMIN, Role.GERENTE, Role.ATENDENTE, Role.CLIENTE)
  @ApiOperation({ summary: 'Consulta pagamento pelo pedido.' })
  @ApiOkResponse({ description: 'Pagamento encontrado.', schema: { example: pagamentoAprovadoResponseExample.pagamento } })
  @ApiNotFoundResponse({ description: 'Pagamento não encontrado.' })
  @Get(':pedidoId')
  buscarPorPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number, @CurrentUser() user: AuthUser) {
    return this.pagamentosService.buscarPorPedido(pedidoId, user);
  }
}
