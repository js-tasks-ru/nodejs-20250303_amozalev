import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto): Promise<CreateTaskDto & Task> {
    return this.taskRepository.save(createTaskDto);
  }

  async findAll(page?: number, limit?: number): Promise<Task[]> {
    return this.taskRepository.find(
      page && limit ? { skip: (page - 1) * limit, take: limit } : {},
    );
  }

  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async update(id: number, updatedTask: UpdateTaskDto): Promise<Task> {
    const res = await this.taskRepository.update(id, updatedTask);
    if (res?.affected > 0) {
      return await this.findOne(id);
    }
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.taskRepository.delete(id);
    if (res?.affected > 0) {
      return true;
    }
  }
}
