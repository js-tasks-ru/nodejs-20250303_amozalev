import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [Task],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get(getRepositoryToken(Task));
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterEach(async () => {
    await repository.clear();
  })

  afterAll(async () => {
    await app.close();
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const response1 = await request(app.getHttpServer()).get("/tasks/");
      expect(response1.status).toBe(200);
      expect(response1.body).toEqual([]);

      const dto: CreateTaskDto = {
        title: "First task",
        description: "First task description",
      };
      const task = repository.create(dto);
      await repository.save(task);

      const response2 = await request(app.getHttpServer()).get("/tasks/");
      expect(response2.status).toBe(200);
      expect(response2.body).toEqual([
        {
          id: 1,
          title: "First task",
          description: "First task description",
          isCompleted: false,
        },
      ]);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const existingId = 2;

      const dto: CreateTaskDto = {
        title: "First task",
        description: "First task description",
      };
      const task = repository.create(dto);
      await repository.save(task);

      const response = await request(app.getHttpServer()).get(
        `/tasks/${existingId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 2,
        title: "First task",
        description: "First task description",
        isCompleted: false,
      });
    });

    it("should return 404 if task not found", async () => {
      const nonExistingId = 100;

      const response = await request(app.getHttpServer()).get(
        `/tasks/${nonExistingId}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not Found");
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const taskDto: CreateTaskDto = {
        title: "New task",
        description: "Super important task!",
      };

      //TODO beforeEach repository.clear() не работает? Почему-то учитываются индексы ранее сохранённых задач:
      // при этом задачу с id == 1 не найти. Т.е. @PrimaryGeneratedColumn в БД не обнуляется после repository.clear?
      // в документации к clear говорится следующее: Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.
      const task = await repository.findOne({ where: { id: 1 } });
      console.log("==", task);
      //TODO end

      const response = await request(app.getHttpServer())
        .post(`/tasks`)
        .send(taskDto);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        ...taskDto,
        id: 1,
        isComplete: false,
      });
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      const dto: UpdateTaskDto = {
        title: "Some task to update",
        description: "Some task description",
        isCompleted: true,
      };

      const task = repository.create(dto);
      const savedTask = await repository.save(task);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${savedTask.id}`)
        .send(dto);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        ...dto,
        id: savedTask.id,
      });
    });

    it("should return 404 when updating non-existent task", async () => {
      const nonExistingId = 100;

      const dto: UpdateTaskDto = {
        title: "Non existing task",
        description: "Non existing task",
        isCompleted: true,
      };

      const nonExistingTask = await repository.findOne({
        where: { id: nonExistingId },
      });
      expect(nonExistingTask).toEqual(null);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${nonExistingId}`)
        .send(dto);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not Found");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      const dto: CreateTaskDto = {
        title: "Some task to delete",
        description: "Some task description",
      };

      const task = repository.create(dto);
      const savedTask = await repository.save(task);
      // repository.remove возвращает entity без id. описано в https://github.com/typeorm/typeorm/issues/7024#issuecomment-948519328
      const { id, ...expectedRemovedTask } = savedTask;

      const response = await request(app.getHttpServer()).delete(
        `/tasks/${savedTask.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        ...expectedRemovedTask,
      });
    });

    it("should return 404 when deleting non-existent task", async () => {
      const nonExistingId = 100;

      const nonExistingTask = await repository.findOne({
        where: { id: nonExistingId },
      });
      expect(nonExistingTask).toEqual(null);

      const response = await request(app.getHttpServer()).delete(
        `/tasks/${nonExistingId}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not Found");
    });
  });
});
