import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, Task } from "./task.model";

const TASK_NOT_FOUND_MSG = "Task with such Id does not exist";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get(":id")
  getTaskById(@Param("id") id: string) {
    const task = this.tasksService.getTaskById(id);
    if (task) {
      return task;
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto) {
    return this.tasksService.createTask(task);
  }

  @Patch(":id")
  updateTask(@Param("id") id: string, @Body() task: Task) {
    const updatedTask = this.tasksService.updateTask(id, task);
    if (updatedTask) {
      return updatedTask;
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: string) {
    const removedTask = this.tasksService.deleteTask(id);
    if (removedTask) {
      return removedTask;
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }
}
