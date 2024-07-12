import ITodo from "@/core/todo/models/ITodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import ReadTodosByUserId from "@/core/todo/services/ReadTodosByUserId"

describe("Test ReadTodosByUserId.ts", () => {
  let todoRepositoryMock: jest.Mocked<ITodoRepository>
  let readTodosByUserIdMock: ReadTodosByUserId

  beforeEach(() => {
    todoRepositoryMock = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    readTodosByUserIdMock = new ReadTodosByUserId(todoRepositoryMock)
  })

  it("Should return empty array when user don't have to-dos", async () => {
    todoRepositoryMock.readTodosByUserId.mockResolvedValue([])

    const todoListResponse = await readTodosByUserIdMock.execute("1")

    expect(todoListResponse).toEqual([])
    expect(todoRepositoryMock.readTodosByUserId).toHaveBeenCalledWith("1")
  })

  it("Sholt return an array with 1 or more to-dos", async () => {
    const todoList: ITodo[] = [
      { title: "Test title", description: "Test description" },
      { title: "Test title", description: "Test description" }
    ]

    todoRepositoryMock.readTodosByUserId.mockResolvedValue(todoList)

    const todoListResponse = await readTodosByUserIdMock.execute("1")

    expect(todoListResponse.length).toBeGreaterThan(1)
    expect(todoRepositoryMock.readTodosByUserId).toHaveBeenCalledWith("1")
  })
})
