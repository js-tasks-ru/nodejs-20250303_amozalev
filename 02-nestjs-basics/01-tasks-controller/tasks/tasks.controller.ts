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
import { Task } from "./task.model";

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

    throw new HttpException("Wrong task id", HttpStatus.NOT_FOUND);
  }

  @Post()
  createTask(@Body() task: Task) {
    return this.tasksService.createTask(task);
  }

  @Patch(":id")
  updateTask(@Param("id") id: string, @Body() task: Task) {
    const updatedTask = this.tasksService.updateTask(id, task);
    if (updatedTask) {
      return updatedTask;
    }

    throw new HttpException("Wrong task id", HttpStatus.NOT_FOUND);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: string) {
    const removedTask = this.tasksService.deleteTask(id);
    if (removedTask) {
      return removedTask;
    }

    throw new HttpException("Wrong task id", HttpStatus.NOT_FOUND);
  }
}
