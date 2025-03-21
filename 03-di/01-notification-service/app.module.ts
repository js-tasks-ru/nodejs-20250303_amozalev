import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./tasks/tasks.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { NotificationsService } from "./notifications/notifications.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [".env.development"], isGlobal: true }),
    TasksModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [NotificationsService],
})
export class AppModule {}
