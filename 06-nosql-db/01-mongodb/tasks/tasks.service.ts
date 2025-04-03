import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { Model, ObjectId } from "mongoose";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto) {
      const task = new this.taskModel(createTaskDto);
      return await task.save();
  }

  async findAll() {
    return await this.taskModel.find().exec();
  }

  async findOne(id: ObjectId) {
    const task = await this.taskModel.findById(id).exec();
    if (task) {
      return task;
    }
    return null;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (task) {
      return task;
    }
    return null;
  }

  async remove(_id: ObjectId) {
    const removed = await this.taskModel.findOneAndDelete({_id}).exec();
    if (removed) {
      return removed;
    }
    return null;
  }
}
