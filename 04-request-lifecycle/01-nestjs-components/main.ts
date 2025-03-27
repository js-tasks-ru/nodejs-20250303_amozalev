import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggingMiddleware } from "./middlewares/logging.middleware";
import { HttpErrorFilter } from "./filters/http-error.filter";
import { ApiVersionInterceptor } from "./interceptors/api-version.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new LoggingMiddleware().use);
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new ApiVersionInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
