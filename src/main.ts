import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './module/app.module';
import { ClusterService } from './service/cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pkg = JSON.parse(
    await promises.readFile(join('.', 'package.json'), 'utf-8'),
  );
  const version = (pkg as unknown as { version?: string }).version ?? '0.0.0';
  app.use(helmet());
  const options = new DocumentBuilder()
    .setTitle('Flag Service')
    .setDescription('Feature flag service to use in dev projects')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui.html', app, document);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('server.port'));
}

if (process.env.CLUSTER_ENABLED == 'true') {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ClusterService.clusterize(bootstrap);
} else {
  void bootstrap();
}
