import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./auth/jwt.guard";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: [".env.development"],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
