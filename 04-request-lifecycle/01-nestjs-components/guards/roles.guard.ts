import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.headers["x-role"] === "admin";
  }
}
