import { INestApplication, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

export function configureApp(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const details = errors.flatMap((error) =>
          Object.values(error.constraints ?? {}).map((issue) => ({
            field: error.property,
            issue
          }))
        );

        return new UnprocessableEntityException({
          error: 'VALIDATION_ERROR',
          message: 'Dados invalidos.',
          details
        });
      }
    })
  );
}

export function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Raizes do Nordeste API')
    .setDescription('API REST para pedidos multicanal, pagamento mock, estoque, fidelidade e auditoria.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);
}
