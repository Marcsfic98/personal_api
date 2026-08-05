import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Personal API')
    .setDescription('Documentação das rotas e serviços da aplicação Personal API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  process.env.TZ = '-03:00';

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`🚀 Servidor rodando com sucesso na porta: ${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/api/docs`);
}

void bootstrap();
