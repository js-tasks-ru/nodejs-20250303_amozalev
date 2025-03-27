import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import * as fs from "node:fs";
import * as path from "node:path";

export class HttpErrorFilter implements ExceptionFilter {
  private readonly logFile = path.resolve(__dirname, "error.log");

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const dateTime = new Date().toISOString();
    const logMsg = `[${dateTime}] ${status} - ${exception.message}\n`;

    fs.appendFileSync(this.logFile, logMsg);

    resp.status(status).json({
      statusCode: 400,
      message: exception.message,
      timestamp: dateTime,
    });
  }
}
