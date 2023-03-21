import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import {
  APP_BASE_PATH,
  DOCUMENTATION_PATH,
} from 'src/common/constants/constants';
import { AppConfigService } from './app-config.service';

export const enableConfig = async (app: INestApplication) => {
  const isProdMode = app.get(AppConfigService).environment == 'production';

  if (!isProdMode) enableApiDocumentation(app);
  if (!isProdMode) app.enableCors();

  enableSecurity(app);

  enableValidationPipe(app);

  app.setGlobalPrefix(APP_BASE_PATH);
};

const enableSecurity = (app: INestApplication) => {
  app.use(helmet());
};

const enableValidationPipe = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
};

const enableApiDocumentation = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('WiiQare REST API')
    .setDescription('This is a documentation for wiiQare: Version 1 ')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(DOCUMENTATION_PATH, app, document);
};
