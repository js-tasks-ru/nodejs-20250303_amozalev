import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Prioriry } from "../dto/create-task.dto";
import { getTomorrowDateTime } from "../../utils/utils";

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ unique: true, required: true })
  title: string;

  @Prop({required: true})
  description: string;

  @Prop({default: getTomorrowDateTime()})
  deadline: Date;

  @Prop({default: Prioriry.NORMAL})
  priority: Prioriry;

  @Prop({default: false})
  isCompleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
