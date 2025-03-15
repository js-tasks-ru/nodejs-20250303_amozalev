import { IsNotEmpty, IsEnum } from "class-validator";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export class CreateTaskDto implements Task {
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
