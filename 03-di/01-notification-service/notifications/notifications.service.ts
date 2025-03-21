import * as fs from "node:fs";
import * as path from "node:path";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsService {
  private readonly logFile = path.resolve(__dirname, "file.log");

  constructor(private configService: ConfigService) {
    const emailSender = configService.get("SENDER_EMAIl");
    const smsGateway = configService.get("SMS_GATEWAY");
    console.log("Configuration:", emailSender, smsGateway);
  }

  sendEmail(to: string, subject: string, message: string): void {
    if (!to) {
      throw new BadRequestException("Поле Email пустое");
    }

    const logMsg = `Email sent to ${to}: [Новая задача] Вы назначены ответственным за задачу: "${subject}"`;
    this.log(logMsg);
  }

  sendSMS(to: string, message: string): void {
    if (!to) {
      throw new BadRequestException("Поле Email пустое");
    }

    const logMsg = `SMS sent to ${to}: Статус задачи "Сделать домашнюю работу" изменён на "completed"`;
    this.log(logMsg);
  }

  log(logMsg: string) {
    const logMsgWithDate = `${new Date().toDateString()}: ${logMsg}\n`;

    fs.appendFile(this.logFile, logMsgWithDate, (err) => {
      if (err) {
        console.error(err);
      }
    });
    console.log(logMsg);
  }
}
