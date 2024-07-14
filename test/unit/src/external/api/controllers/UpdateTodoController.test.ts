import ITodo from "@/core/todo/models/ITodo"
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

    mockTodoRepository = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    updateTodoUseCaseMock = new UpdateTodo(mockTodoRepository)

    jest.spyOn(updateTodoUseCaseMock, "execute")
  })

  it("shold return 403 when user is not authenticated", async () => {
    (updateTodoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("You do not have permission to access this resource"))

    new UpdateTodoController(app, updateTodoUseCaseMock, authMiddlewareMock(false))

    const response = await request(app)
      .patch("/api/todos/1")

    expect(response.status).toBe(403)
    expect(response.text).toBe("You do not have permission to access this resource")
    expect(updateTodoUseCaseMock.execute).not.toHaveBeenCalled()
  })

  it("Shold return 200 when to-do is updated successfully", async () => {
    (updateTodoUseCaseMock.execute as jest.Mock).mockResolvedValue(null)

    new UpdateTodoController(app, updateTodoUseCaseMock, authMiddlewareMock(true))

    const updatedTodo: ITodo = {
      id: "1",
      userId: "1",
      title: "Updated todo title",
      description: "Updated todo description",
      completed: "true"
    }

    const response = await request(app)
      .patch("/api/todos/1")
      .set("Authorization", "Bearer authentication-token")
      .send(updatedTodo)

    expect(response.status).toBe(200)
    expect(updateTodoUseCaseMock.execute).toHaveBeenCalledWith(updatedTodo)
  })
})
