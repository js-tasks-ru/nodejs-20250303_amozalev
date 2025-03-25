import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Configuration } from "./types";
import { ValueProvider } from "@nestjs/common/interfaces/modules/provider.interface";

const configurationProvider: ValueProvider<Configuration> = {
  provide: "CONFIG",
  useValue: {
    senderEmail: "task_service_notificator@mail.com",
  },
};

@Module({
  providers: [NotificationsService, configurationProvider],
  exports: [NotificationsService],
})
export class NotificationsModule {}
