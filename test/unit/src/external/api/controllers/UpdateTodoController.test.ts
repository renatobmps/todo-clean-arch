import errors from "@/core/shared/errors"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import UpdateTodo from "@/core/todo/services/UpdateTodo"
import IUser from "@/core/user/models/IUser"
import UpdateTodoController from "@/external/api/controllers/UpdateTodoController"
import { ReqWithUser } from "@/external/api/middlewares/authMiddleware"
import express, { Response, Express, NextFunction } from "express"
import request from "supertest"

describe("Test UpdateTodoContoller.ts", () => {
  let app: Express
  let mockTodoRepository: jest.Mocked<ITodoRepository>
  let updateTodoUseCaseMock: UpdateTodo

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

    mockTodoRepository = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    updateTodoUseCaseMock = new UpdateTodo(mockTodoRepository)
  })

  it("shold return 403 when user is not authenticated", async () => {
    new UpdateTodoController(app, updateTodoUseCaseMock, mockAuthMiddleware(false))

    const response = await request(app)
      .patch("/api/todos/1")

    expect(response.status).toBe(403)
    expect(response.text).toBe(errors.ACCESS_DENIED)
  })

  it("Shold return 200 when to-do is updated successfully", async () => {
    new UpdateTodoController(app, updateTodoUseCaseMock, mockAuthMiddleware(true))

    const response = await request(app)
      .patch("/api/todos/1")
      .set("Authorization", "Bearer authentication-token")

    expect(response.status).toBe(200)
  })
})
