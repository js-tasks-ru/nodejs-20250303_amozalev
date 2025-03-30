import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import database from "./config/database";
import { DataSource } from "typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
    }),
    TasksModule,
    TypeOrmModule.forRootAsync(database.asProvider() as TypeOrmModuleOptions),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
