import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { Task } from "../entities/task.entity";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { getRepositoryToken } from "@nestjs/typeorm";

const DEFAULT_TASKS = [
  {
    title: "First task",
    description: "First task description",
  },
  {
    title: "Second task",
    description: "Second task description",
  },
].map((dto, ind) => ({
  ...dto,
  id: ++ind,
  isCompleted: false,
}));

describe("TasksService", () => {
  let service: TasksService;

  let mockedTasks = DEFAULT_TASKS.map((task) => ({ ...task }));

  const mockTasksRepository = {
    create: jest.fn((dto: CreateTaskDto) => {
      let lastId = mockedTasks[mockedTasks.length - 1].id ?? 0;
      return {
        ...dto,
        id: ++lastId,
        isCompleted: false,
      } as Task;
    }),
    save: jest.fn((task: Task) => task),
    find: jest.fn(() => mockedTasks),
    findOneBy: jest.fn(({ id: taskId }: { id: number }) =>
      mockedTasks.find(({ id }) => id === taskId),
    ),
    remove: jest.fn((task: Task) => task),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTasksRepository },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  afterEach(() => {
    mockedTasks = DEFAULT_TASKS.map((task) => ({ ...task }));
    jest.clearAllMocks();
  });

  it("Должен быть определён", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const dto: CreateTaskDto = {
        title: "Third task",
        description: "Third task description",
      };

      let lastId = DEFAULT_TASKS[DEFAULT_TASKS.length - 1].id ?? 0;
      const task: Task = {
        ...dto,
        id: ++lastId,
        isCompleted: false,
      };

      const savedTask = await service.create(dto);
      expect(savedTask).toEqual(task);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const tasks = await service.findAll();

      expect(Array.isArray(tasks)).toEqual(true);
      expect(tasks.length).toEqual(2);
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      const firstTask = await service.findOne(1);
      expect(firstTask).toEqual(DEFAULT_TASKS[0]);

      const secondTask = await service.findOne(2);
      expect(secondTask).toEqual(DEFAULT_TASKS[1]);
      expect(firstTask).not.toEqual(DEFAULT_TASKS[1]);
    });

    it("should throw NotFoundException when task does not exist", async () => {
      try {
        await service.findOne(3);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const firstTask = await service.findOne(1);
      const updatedTask: Task = {
        ...firstTask,
        title: "Updated first task",
        isCompleted: true,
      };

      const result = await service.update(1, updatedTask);
      expect(result).toEqual(updatedTask);
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      try {
        const updatedTask: UpdateTaskDto = {
          title: "Updated task",
          description: "Updated task description",
          isCompleted: true,
        };

        await service.update(100, updatedTask);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      const taskId = 1;
      const task = await service.remove(taskId);

      expect(task).toEqual(DEFAULT_TASKS.find(({ id }) => id === taskId));
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      const taskId = 100;

      try {
        await service.remove(taskId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
