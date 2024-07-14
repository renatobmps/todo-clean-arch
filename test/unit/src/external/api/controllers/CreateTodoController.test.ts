import express, { Express, NextFunction, Response } from "express"
import CreateTodo from "@/core/todo/services/CreateTodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import CreateTodoController from "@/external/api/controllers/CreateTodoController"
import ITodo from "@/core/todo/models/ITodo"
import IUser from "@/core/user/models/IUser"
import request from "supertest"
import { ReqWithUser } from "@/external/api/middlewares/authMiddleware"

describe("Test CreateTodoController.ts", () => {
  let app: Express
  let createTodoUseCaseMock: CreateTodo
  let todoRepositoryMock: jest.Mocked<ITodoRepository>

  function authMiddlewareMock(isValidUser: boolean) {
    return (req: ReqWithUser, res: Response, next: NextFunction) => {
      const user: IUser = { name: "John Doe", email: "john@email.com", password: "P4ssw0rd@123" }
      isValidUser ? req.user = user : req.user = undefined
      next()
    }
  }

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    todoRepositoryMock = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    createTodoUseCaseMock = new CreateTodo(todoRepositoryMock)

    jest.spyOn(createTodoUseCaseMock, "execute")
  })

  it("Shold return 403 when user is not authenticated", async () => {
    new CreateTodoController(app, createTodoUseCaseMock, authMiddlewareMock(false))

    const response = await request(app)
      .post("/api/todos")

    expect(response.status).toBe(403)
  })

  it("Should return 400 when title is missig", async () => {
    (createTodoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("Title cannot be empty."))

    new CreateTodoController(app, createTodoUseCaseMock, authMiddlewareMock(true))

    const newTodo: ITodo = { title: "", description: "Test description" }

    const response = await request(app)
      .post("/api/todos")
      .set("Authorization", "Bearer valid-token")
      .send(newTodo)

    expect(response.status).toBe(400)
    expect(response.text).toBe("Title cannot be empty.")
    expect(createTodoUseCaseMock.execute).toHaveBeenCalledWith(newTodo)
  })

  it("Should return 400 http status code when description is missig", async () => {
    (createTodoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("Description cannot be empty."))

    new CreateTodoController(app, createTodoUseCaseMock, authMiddlewareMock(true))

    const newTodo: ITodo = { title: "Test title", description: "" }

    const response = await request(app)
      .post("/api/todos")
      .set("Authorization", "Bearer valid-token")
      .send(newTodo)

    expect(response.status).toBe(400)
    expect(response.text).toBe("Description cannot be empty.")
    expect(createTodoUseCaseMock.execute).toHaveBeenCalledWith(newTodo)
  })

  it("Should return 201 http status code when to-do is successfully created", async () => {
    (createTodoUseCaseMock.execute as jest.Mock).mockResolvedValue(null)

    new CreateTodoController(app, createTodoUseCaseMock, authMiddlewareMock(true))

    const newTodo: ITodo = { title: "Test title", description: "Test desctiption" }

    const response = await request(app)
      .post("/api/todos")
      .send(newTodo)

    expect(response.status).toBe(201)
    expect(createTodoUseCaseMock.execute).toHaveBeenCalledWith(newTodo)
    expect(createTodoUseCaseMock.execute).toHaveBeenCalledWith(newTodo)
  })
})
