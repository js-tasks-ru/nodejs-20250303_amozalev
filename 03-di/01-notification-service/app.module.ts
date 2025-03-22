import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { NotificationsService } from "./notifications/notifications.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TasksModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [NotificationsService],
})
export class AppModule {}
