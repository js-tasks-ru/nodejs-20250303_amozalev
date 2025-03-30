import { registerAs } from "@nestjs/config";
import { Task } from "../tasks/entities/task.entity";


export default registerAs('database', () => ({
  type: 'sqlite',
  database: './db.sqlite',
  entities: [Task],
  autoloadEntities: true,
  synchronize: true
}))
