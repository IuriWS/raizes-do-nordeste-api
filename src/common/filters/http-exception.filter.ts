import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const normalized = this.normalize(exception);

    response.status(normalized.statusCode).json({
      error: normalized.error,
      message: normalized.message,
      details: normalized.details,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers['x-request-id']
    });
  }

  private normalize(exception: unknown) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Codigos conhecidos do Prisma viram respostas HTTP estaveis para o cliente.
      if (exception.code === 'P2002') {
        return {
          statusCode: HttpStatus.CONFLICT,
          error: 'CONFLICT',
          message: 'Registro duplicado.',
          details: [{ field: String(exception.meta?.target ?? 'unique'), issue: 'valor ja utilizado' }]
        };
      }

      if (exception.code === 'P2025') {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'NOT_FOUND',
          message: 'Registro nao encontrado.',
          details: []
        };
      }
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = exception.getResponse();
      const body = typeof payload === 'string' ? { message: payload } : (payload as Record<string, unknown>);

      return {
        statusCode,
        error: String(body.error ?? this.defaultErrorName(statusCode)),
        message: String(body.message ?? exception.message),
        details: Array.isArray(body.details) ? body.details : []
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL_ERROR',
      message: 'Erro interno inesperado.',
      details: []
    };
  }

  private defaultErrorName(statusCode: number) {
    const names: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR'
    };

    return names[statusCode] ?? 'HTTP_ERROR';
  }
}
