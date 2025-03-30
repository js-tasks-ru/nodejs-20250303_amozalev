import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import * as fs from "node:fs";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logFile = "errors.log";

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception?.getStatus() : 500;
    const dateTime = new Date().toISOString();
    const logMsg = `[${dateTime}] ${status} - ${exception.message}\n`;

    fs.appendFileSync(this.logFile, logMsg);

    resp.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: dateTime,
    });
  }
}
