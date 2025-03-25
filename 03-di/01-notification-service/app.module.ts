import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TasksModule,
    NotificationsModule,
    UsersModule,
  ],
})
export class AppModule {}
