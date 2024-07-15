import ITodo from "@/core/todo/models/ITodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import UpdateTodo from "@/core/todo/services/UpdateTodo"

describe("Test UpdateTodo.ts", () => {
  let todoRepositoryMock: jest.Mocked<ITodoRepository>
  let updateTodoUseCaseMock: UpdateTodo

  beforeEach(() => {
    todoRepositoryMock = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    updateTodoUseCaseMock = new UpdateTodo(todoRepositoryMock)
  })


  it("Shold update to-do successfully", async () => {
    const updatedTodo: ITodo = { title: "Test Title", description: "Test description" }

    await updateTodoUseCaseMock.execute(updatedTodo)

    expect(todoRepositoryMock.update).toHaveBeenCalledWith(updatedTodo)
  })
})
