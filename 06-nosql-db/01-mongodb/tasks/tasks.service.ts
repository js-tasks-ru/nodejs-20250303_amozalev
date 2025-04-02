import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { Model, ObjectId } from "mongoose";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  create(createTaskDto: CreateTaskDto) {
    try {
      const task = new this.taskModel(createTaskDto);
      return task.save();
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async findAll() {
    return this.taskModel.find().exec();
  }

  async findOne(id: ObjectId) {
    const task = this.taskModel.findById(id).exec();
    if (task) {
      return task;
    }
    return null;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto) {
    const task = this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (task) {
      return task;
    }
    return null;
  }

  async remove(id: ObjectId) {
    const removed = this.taskModel.findOneAndDelete({_id: {$eq: id}}).exec();
    if (removed) {
      return removed;
    }
    return null;
  }
}
