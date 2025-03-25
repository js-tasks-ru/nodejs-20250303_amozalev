import * as fs from "node:fs";
import * as path from "node:path";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Configuration } from "./types";

@Injectable()
export class NotificationsService {
  private readonly logFile = path.resolve(__dirname, "file.log");

  constructor(@Inject("CONFIG") config: Configuration) {
    console.log("Config:", config.senderEmail);
  }

  sendEmail(to: string, subject: string, message: string): void {
    if (!to) {
      throw new BadRequestException("Email пустой");
    }

    const logMsg = `Email sent to ${to}: [${subject}] ${message}`;
    this.log(logMsg);
  }

  sendSMS(to: string, message: string): void {
    if (!to) {
      throw new BadRequestException("Номер телефона пустой");
    }

    const logMsg = `SMS sent to ${to}: ${message}`;
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
