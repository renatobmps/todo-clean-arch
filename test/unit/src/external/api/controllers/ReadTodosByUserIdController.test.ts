import express, { Express, NextFunction, Response } from "express"
import ReadTodosByUserIdController from "@/external/api/controllers/ReadTodosByUserIdController"
import { ReqWithUser } from "@/external/api/middlewares/authMiddleware"
import IUser from "@/core/user/models/IUser"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import ReadTodosByUserId from "@/core/todo/services/ReadTodosByUserId"
import request from "supertest"

describe("Test ReadTodosByUserId.ts", () => {
  let app: Express
  let readTodosByUserIdUseCaseMock: ReadTodosByUserId
  let todoRepositoryMock: jest.Mocked<ITodoRepository>

  function authMiddlewareMock(isValidUser: boolean) {
    return (req: ReqWithUser, res: Response, next: NextFunction,) => {
      const user: IUser = { id: "1", name: "John Doe", email: "john@email.com", password: "P4ssW0rd@123" }
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

    readTodosByUserIdUseCaseMock = new ReadTodosByUserId(todoRepositoryMock)

    jest.spyOn(readTodosByUserIdUseCaseMock, "execute")
  })

  it("Shold return 403 when user is not authenticated", async () => {
    (readTodosByUserIdUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("You do not have permission to access this resource"))

    new ReadTodosByUserIdController(app, readTodosByUserIdUseCaseMock, authMiddlewareMock(false))

    const response = await request(app)
      .get("/api/todos")

    expect(response.status).toBe(403)
    expect(response.text).toBe("You do not have permission to access this resource")
    expect(readTodosByUserIdUseCaseMock.execute).not.toHaveBeenCalled()
  })

  it("Shold return 200 when the user is authenticated", async () => {
    (readTodosByUserIdUseCaseMock.execute as jest.Mock).mockResolvedValue([])

    new ReadTodosByUserIdController(app, readTodosByUserIdUseCaseMock, authMiddlewareMock(true))

    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", "Bearer authorization-token")
      .send()

    expect(response.status).toBe(200)
    expect(readTodosByUserIdUseCaseMock.execute).toHaveBeenCalledWith("1")
  })
})
