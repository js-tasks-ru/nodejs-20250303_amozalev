import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { Task } from "../entities/task.entity";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("TasksService", () => {
  let service: TasksService;

  let mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
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
    jest.clearAllMocks();
  });

  it("Должен быть определён", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const mockedDto: CreateTaskDto = {
        title: "First task",
        description: "First task description",
      };
      const mockedTask: Task = {
        ...mockedDto,
        id: 1,
        isCompleted: false,
      };
      mockTasksRepository.create.mockReturnValue(mockedTask);
      mockTasksRepository.save.mockReturnValue(mockedTask);

      const task = new Task();
      Object.assign(task, mockedDto);

      const savedTask = await service.create(task);
      expect(savedTask).toEqual(mockedTask);

      // const taskInDb = await repository.findOneBy({ id: 1 });
      // expect(savedTask).toEqual(taskInDb);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const mockedDtos: CreateTaskDto[] = [
        {
          title: "First task",
          description: "First task description",
        },
        {
          title: "Second task",
          description: "Second task description",
        },
      ];
      const mockedTasks = mockedDtos.map((dto, ind) => ({
        ...dto,
        id: ind,
        isCompleted: false,
      }));

      mockTasksRepository.create.mockImplementation((dto: CreateTaskDto) => {
        return mockedTasks.find(
          ({ title, description }) =>
            title === dto.title && description === dto.description,
        );
      });
      mockTasksRepository.save.mockImplementation((dto: CreateTaskDto) => {
        return mockedTasks.find(
          ({ title, description }) =>
            title === dto.title && description === dto.description,
        );
      });
      mockTasksRepository.find.mockReturnValue(mockedTasks);

      for (const dto of mockedDtos) {
        const _task = new Task();
        Object.assign(_task, dto);
        await service.create(_task);
      }

      const tasks = await service.findAll();

      expect(Array.isArray(tasks)).toEqual(true);
      expect(tasks.length).toEqual(2);
    });
  });

  describe("findOne", () => {
    let mockedDtos: CreateTaskDto[] = [];
    let mockedTasks: Task[] = [];

    beforeEach(async () => {
      mockedDtos = [
        {
          title: "First task",
          description: "First task description",
        },
        {
          title: "Second task",
          description: "Second task description",
        },
      ];

      for (const dto of mockedDtos) {
        const _task = new Task();
        Object.assign(_task, dto);
        await service.create(_task);
      }

      mockedTasks = mockedDtos.map((dto, ind) => ({
        ...dto,
        id: ++ind,
        isCompleted: false,
      }));
    });

    it("should return a task when it exists", async () => {
      mockTasksRepository.findOneBy.mockImplementation(
        ({ id: taskId }: { id: number }) =>
          mockedTasks.find(({ id }) => id === taskId),
      );

      const firstTask = await service.findOne(1);
      expect(firstTask).toEqual(mockedTasks[0]);

      const secondTask = await service.findOne(2);
      expect(secondTask).toEqual(mockedTasks[1]);
      expect(firstTask).not.toEqual(mockedTasks[1]);
    });

    it("should throw NotFoundException when task does not exist", async () => {
      const spy = jest.spyOn(mockTasksRepository, "findOneBy");
      spy.mockImplementation(
        (taskId: number) => mockedTasks.find(({ id }) => id === taskId) ?? null,
      );

      try {
        await service.findOne(3);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("update", () => {
    let mockedDtos: CreateTaskDto[] = [];
    let mockedTasks: Task[] = [];

    beforeEach(async () => {
      mockedDtos = [
        {
          title: "First task",
          description: "First task description",
        },
      ];

      for (const dto of mockedDtos) {
        const _task = new Task();
        Object.assign(_task, dto);
        await service.create(_task);
      }

      mockedTasks = mockedDtos.map((dto, ind) => ({
        ...dto,
        id: ++ind,
        isCompleted: false,
      }));

      mockTasksRepository.findOneBy.mockImplementation(
        ({ id: taskId }: { id: number }) =>
          mockedTasks.find(({ id }) => id === taskId) ?? null,
      );
      mockTasksRepository.save.mockImplementation(
        ({ id: taskId }: { id: number }) =>
          mockedTasks.find(({ id }) => id === taskId) ?? null,
      );
    });

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
    let mockedDtos: CreateTaskDto[] = [];
    let mockedTasks: Task[] = [];

    beforeEach(async () => {
      mockedDtos = [
        {
          title: "First task",
          description: "First task description",
        },
      ];

      for (const dto of mockedDtos) {
        const _task = new Task();
        Object.assign(_task, dto);
        await service.create(_task);
      }

      mockedTasks = mockedDtos.map((dto, ind) => ({
        ...dto,
        id: ++ind,
        isCompleted: false,
      }));

      mockTasksRepository.findOneBy.mockImplementation(
        ({ id: taskId }: { id: number }) =>
          mockedTasks.find(({ id }) => id === taskId) ?? null,
      );
      mockTasksRepository.remove.mockImplementation((task: Task) => task);
    });

    it("should remove a task when it exists", async () => {
      const taskId = 1;
      const task = await service.remove(taskId);

      expect(task).toEqual(mockedTasks.find(({ id }) => id === taskId));
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
