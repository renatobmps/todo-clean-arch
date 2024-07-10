import errors from "@/core/shared/errors"
import ITodo from "@/core/todo/models/ITodo"
import CreateTodo from "@/core/todo/services/CreateTodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"

describe("Test CreateTodo.ts", () => {
  let createTodoUseCaseMock: CreateTodo
  let todoRepositoryMock: jest.Mocked<ITodoRepository>

  beforeEach(() => {
    todoRepositoryMock = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    createTodoUseCaseMock = new CreateTodo(todoRepositoryMock)
  })

  it("Should throw an error when title is missing", async () => {
    const newTodo: ITodo = { title: "", description: "Test Description" }
    await expect(createTodoUseCaseMock.execute(newTodo)).rejects.toThrow(errors.TITLE_REQUIRED)
  })

  it("Should throw an error when description is missing", async () => {
    const newTodo: ITodo = { title: "Test Title", description: "" }
    await expect(createTodoUseCaseMock.execute(newTodo)).rejects.toThrow(errors.DESCRIPTION_REQUIRED)
  })

  it("Shold create a new to-do when all data is valid", async () => {
    const newTodo: ITodo = { title: "Test Title", description: "Test Description" }
    await createTodoUseCaseMock.execute(newTodo)
    expect(todoRepositoryMock.create).toHaveBeenCalledWith(newTodo)
  })
})
