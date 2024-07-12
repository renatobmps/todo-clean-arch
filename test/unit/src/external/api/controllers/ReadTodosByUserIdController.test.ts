import express, { Express, NextFunction, Response } from "express"
import ReadTodosByUserIdController from "@/external/api/controllers/ReadTodosByUserIdController"
import { ReqWithUser } from "@/external/api/middlewares/authMiddleware"
import IUser from "@/core/user/models/IUser"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import ReadTodosByUserId from "@/core/todo/services/ReadTodosByUserId"
import errors from "@/core/shared/errors"
import request from "supertest"

describe("Test ReadTodosByUserId.ts", () => {
  let app: Express
  let readTodosByUserIdUseCaseMock: ReadTodosByUserId
  let todoRepositoryMock: jest.Mocked<ITodoRepository>

  function mockAuthMiddleware(haveUser: boolean) {
    return (req: ReqWithUser, res: Response, next: NextFunction,) => {
      const user: IUser = { name: "John Doe", email: "john@email.com", password: "P4ssW0rd@123" }
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

    readTodosByUserIdUseCaseMock = new ReadTodosByUserId(todoRepositoryMock)
  })

  it("Shold return 403 when user is not authenticated", async () => {
    new ReadTodosByUserIdController(app, readTodosByUserIdUseCaseMock, mockAuthMiddleware(false))

    const response = await request(app)
      .get("/api/todos")

    expect(response.status).toBe(403)
    expect(response.text).toBe(errors.ACCESS_DENIED)
  })

  it("Shold return 200 when the user is authenticated", async () => {
    new ReadTodosByUserIdController(app, readTodosByUserIdUseCaseMock, mockAuthMiddleware(true))

    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", "Bearer authorization-token")

    expect(response.status).toBe(200)
  })
})
