import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = this.tasksRepository.create(createTaskDto);
    return await this.tasksRepository.save(task);
  }

  async findAll() {
    return await this.tasksRepository.find();
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<Task> {
    const task = await this.findOne(id);
    return await this.tasksRepository.remove(task);
  }
}
