import { Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getTasks(status?: TaskStatus, page?: number, limit?: number): Task[] {
    if (page * limit >= this.tasks.length) {
      return [];
    }

    let tasksCount = 0;
    const tasks: Task[] = [];
    this.tasks.every((task) => {
      if (page && limit && tasksCount === page * limit) {
        return false;
      }

      if (!status || (status && task.status === status)) {
        tasks.push(task);
        tasksCount++;
      }
      return true;
    });

    return tasks;
  }

  // getFilteredTasks(
  //   status?: TaskStatus,
  //   page?: number,
  //   limit?: number,
  // ): Task[] {}
}
