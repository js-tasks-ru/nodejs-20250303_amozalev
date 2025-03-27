import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import * as fs from "node:fs";

export class HttpErrorFilter implements ExceptionFilter {
  private readonly logFile = "errors.log";

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    const dateTime = new Date().toISOString();
    const logMsg = `[${dateTime}] 500 - ${exception.message}\n`;

    fs.appendFileSync(this.logFile, logMsg);

    resp.status(500).json({
      statusCode: 500,
      message: exception.message,
      timestamp: dateTime,
    });
  }
}
