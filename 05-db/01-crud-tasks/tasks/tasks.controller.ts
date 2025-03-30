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
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { FindOneParams } from "./task.model";

const TASK_NOT_FOUND_MSG = "Task with such Id does not exist";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() task: CreateTaskDto) {
    return await this.tasksService.create(task);
  }

  @Get()
  findAll(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.tasksService.findAll(page, limit);
  }

  @Get(":id")
  async findOne(@Param() { id }: FindOneParams) {
    const task = await this.tasksService.findOne(id);
    if (task) {
      return task;
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }

  @Patch(":id")
  async update(@Param() { id }: FindOneParams, @Body() task: UpdateTaskDto) {
    const updatedTask = await this.tasksService.update(id, task);
    if (updatedTask) {
      return updatedTask;
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }

  @Delete(":id")
  async remove(@Param() { id }: FindOneParams) {
    const task = await this.tasksService.remove(id);
    if (task) {
      return task;
    }

    throw new HttpException(TASK_NOT_FOUND_MSG, HttpStatus.NOT_FOUND);
  }
}
