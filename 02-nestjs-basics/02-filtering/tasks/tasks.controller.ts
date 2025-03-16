import { Controller, Get, ParseEnumPipe, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { SortBy, SortByEnum, TaskStatus } from "./task.model";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query("status") status?: TaskStatus,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sortBy", new ParseEnumPipe(SortByEnum))
    sortBy?: SortBy,
  ) {
    return this.tasksService.getTasks(status, page, limit, sortBy);
  }
}
