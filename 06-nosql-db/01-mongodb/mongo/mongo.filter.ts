import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(
    exception: mongoose.Error.ValidationError & mongoose.mongo.MongoError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    resp.status(400).json({
      error: "Bad Request",
      statusCode: 400,
      message: exception.message,
    });
  }
}
