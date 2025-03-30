import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Body,
  Param,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

const TASK_NOT_FOUND_MSG = "Task with such Id does not exist";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() task: CreateTaskDto) {
    return await this.tasksService.create(task);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const num = parseInt(id);
    if (!isNaN(num)) {
      const task = await this.tasksService.findOne(num);
      if (task) {
        return task;
      }
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() task: UpdateTaskDto) {
    const num = parseInt(id);
    if (!isNaN(num)) {
      const updatedTask = await this.tasksService.update(num, task);
      if (updatedTask) {
        return updatedTask;
      }
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const num = parseInt(id);
    if (!isNaN(num)) {
      const task = await this.tasksService.remove(num);
      if (task) {
        return task;
      }
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }
}
