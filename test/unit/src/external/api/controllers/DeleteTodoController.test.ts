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

  function authMiddlewareMock(isValidUser: boolean) {
    return (req: ReqWithUser, res: Response, next: NextFunction,) => {
      const user: IUser = { id: "2", name: "John Doe", email: "john@email.com", password: "P4ssW0rd@123" }
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

    deleteTodoUseCaseMock = new DeleteTodo(todoRepositoryMock)

    jest.spyOn(deleteTodoUseCaseMock, "execute")
  })

  it("Should return 403 when user is not authenticated", async () => {
    (deleteTodoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("You do not have permission to access this resource"))

    new DeleteTodoController(app, deleteTodoUseCaseMock, authMiddlewareMock(false))

    const response = await request(app)
      .delete("/api/todos/1")

    expect(response.status).toBe(403)
    expect(response.text).toBe("You do not have permission to access this resource")
    expect(deleteTodoUseCaseMock.execute).not.toHaveBeenCalled()
  })

  it("shold return 200 when an todo is successfully deleted", async () => {
    (deleteTodoUseCaseMock.execute as jest.Mock).mockResolvedValue(null)

    new DeleteTodoController(app, deleteTodoUseCaseMock, authMiddlewareMock(true))

    const response = await request(app)
      .delete("/api/todos/1")
      .set("Authorization", "Bearer Authentication-token")
      .send({ id: "1", userId: "2" })

    expect(response.status).toBe(200)
    expect(deleteTodoUseCaseMock.execute).toHaveBeenCalledWith({ id: "1", userId: "2" })
  })
})
