import { Injectable } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(({ id: taskId }) => taskId === id);
  }

  createTask(task: Task): Task {
    const lastTask = this.tasks.at(-1);
    const lastId = lastTask?.id;
    const id = lastId && !isNaN(+lastId) ? (+lastId + 1).toString() : "1";
    const newTask = { id, ...task };
    this.tasks.push(newTask);

    return newTask;
  }

  updateTask(id: string, update: Task): Task {
    let updatedTask: Task = null;
    this.tasks.forEach((task, i) => {
      if (task.id === id) {
        this.tasks[i] = { ...task, ...update };
        updatedTask = this.tasks[i];
      }
    });

    if (updatedTask) {
      return updatedTask;
    }
  }

  deleteTask(id: string): Task {
    let removedTask: Task = null;
    this.tasks = this.tasks.filter((task) => {
      if (task.id === id) {
        removedTask = { ...task };
        return false;
      }
      return true;
    });

    if (removedTask) {
      return removedTask;
    }
  }
}
