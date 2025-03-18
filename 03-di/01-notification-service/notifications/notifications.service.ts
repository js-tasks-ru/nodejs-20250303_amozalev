import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  constructor() {}

  sendEmail(to: string, subject: string, message: string): void {
    if (!to) {
      throw new BadRequestException("Поле Email пустое");
    }

    console.log(
      `Email sent to ${to}: [Новая задача] Вы назначены ответственным за задачу: "${subject}"`,
    );
  }

  sendSMS(to: string, message: string): void {
    if (!to) {
      throw new BadRequestException("Поле Email пустое");
    }

    console.log(
      `SMS sent to ${to}: Статус задачи "Сделать домашнюю работу" изменён на "completed"`,
    );
  }
}
