import express, { Express, NextFunction, Response } from "express"
import CreateTodo from "@/core/todo/services/CreateTodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import CreateTodoController from "@/external/api/controllers/CreateTodoController"
import ITodo from "@/core/todo/models/ITodo"
import request from "supertest"
import { ReqWithUser } from "@/external/api/middlewares/authMiddleware"
import errors from "@/core/shared/errors"

const mockAuthMiddleware = (req: ReqWithUser, res: Response, next: NextFunction) => {
  req.user = { name: "John Doe", email: "john@email.com", password: "P4ssW0rd@123" }
  next();
};

describe("Test CreateTodoController.ts", () => {
  let app: Express
  let createTodo: CreateTodo
  let mockTodoRepository: jest.Mocked<ITodoRepository>

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    mockTodoRepository = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    createTodo = new CreateTodo(mockTodoRepository)

    new CreateTodoController(app, createTodo, mockAuthMiddleware)
  })

  it("Should return 400 http status code when title is missig", async () => {
    const newTodo: ITodo = { title: "", description: "Test description" }

    const response = await request(app)
      .post("/api/todos/create")
      .set("Authorization", "Bearer valid-token")
      .send(newTodo)

    expect(response.status).toBe(400)
    expect(response.text).toBe(errors.TITLE_REQUIRED)
  })

  it("Should return 400 http status code when description is missig", async () => {
    const newTodo: ITodo = { title: "Test title", description: "" }

    const response = await request(app)
      .post("/api/todos/create")
      .set("Authorization", "Bearer valid-token")
      .send(newTodo)

    expect(response.status).toBe(400)
    expect(response.text).toBe(errors.DESCRIPTION_REQUIRED)
  })

  it("Should return 201 http status code when to-do is successfully created", async () => {
    const newTodo: ITodo = { title: "Test title", description: "Test desctiption" }

    const response = await request(app)
      .post("/api/todos/create")
      .send(newTodo)

    expect(response.status).toBe(201)
  })
})
