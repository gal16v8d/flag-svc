import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const pkg = JSON.parse(
    await promises.readFile(join('.', 'package.json'), 'utf-8'),
  );
  app.use(helmet());
  const options = new DocumentBuilder()
    .setTitle('Flag Service')
    .setDescription('Feature flag service to use in dev projects')
    .setVersion(pkg.version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui', app, document);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('server.port'));
}
bootstrap();
