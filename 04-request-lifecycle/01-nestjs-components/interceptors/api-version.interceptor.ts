import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { map } from "rxjs";

export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        Object.assign(data, {
          apiVersion: "1.0",
          executionTime: `${Date.now() - now}ms`,
        });
        return data;
      }),
    );
  }
}
