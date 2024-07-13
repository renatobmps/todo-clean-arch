import DeleteTodo from "@/core/todo/services/DeleteTodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import IUser from "@/core/user/models/IUser"
import DeleteTodoController from "@/external/api/controllers/DeleteTodoController"
import { ReqWithUser } from "@/external/api/middlewares/authMiddleware"
import express, { Express, NextFunction, Response } from "express"
import request from "supertest"

describe("Test DeleteTodoController.ts", () => {
  let app: Express
  let deleteTodoUseCaseMock: DeleteTodo
  let todoRepositoryMock: jest.Mocked<ITodoRepository>

  function mockAuthMiddleware(haveUser: boolean) {
    return (req: ReqWithUser, res: Response, next: NextFunction) => {
      const user: IUser = { name: "John Doe", email: "john@email.com", password: "P4ssw0rd@123" }
      haveUser === true ? req.user = user : req.user = undefined
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

    deleteTodoUseCaseMock = new DeleteTodo(todoRepositoryMock)
  })

  it("Should return 403 when user is not authenticated", async () => {
    new DeleteTodoController(app, deleteTodoUseCaseMock, mockAuthMiddleware(false))

    const response = await request(app)
      .delete("/api/todos/1")

    expect(response.status).toBe(403)
  })

  it("shold return 200 when an todo is successfully deleted", async () => {
    new DeleteTodoController(app, deleteTodoUseCaseMock, mockAuthMiddleware(true))

    const response = await request(app)
      .delete("/api/todos/1")
      .set("Authorization", "Bearer Authentication-token")

    expect(response.status).toBe(200)
  })
})

