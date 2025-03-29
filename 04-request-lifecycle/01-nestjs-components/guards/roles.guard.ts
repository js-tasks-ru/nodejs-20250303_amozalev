import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const role: string | undefined = request.headers["x-role"];
    if (role === "admin") {
      return true;
    }

    throw new ForbiddenException("Доступ запрещён: требуется роль admin");
  }
}
