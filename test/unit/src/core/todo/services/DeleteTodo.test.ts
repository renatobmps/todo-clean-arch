import errors from "@/core/shared/errors"
import DeleteTodo, { IDeleteTodoData } from "@/core/todo/services/DeleteTodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"

describe("Test DeleteTodo.ts", () => {
  let todoRepositoryMock: jest.Mocked<ITodoRepository>
  let deleteTodoUseCaseMock: DeleteTodo

  beforeEach(() => {
    todoRepositoryMock = {
      create: jest.fn(),
      readTodosByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    deleteTodoUseCaseMock = new DeleteTodo(todoRepositoryMock)
  })

  it("Should call delete method fom TodoRepository with correct parameters", async () => {
    const todoDataToDelete: IDeleteTodoData = { id: "1", userId: "1" }

    await deleteTodoUseCaseMock.execute(todoDataToDelete)

    expect(todoRepositoryMock.delete).toHaveBeenCalledWith(todoDataToDelete)
  })


  it("Should throw an error when trying to delete another user's to-do", async () => {
    const todoDataToDelete: IDeleteTodoData = { id: "1", userId: "1" }

    todoRepositoryMock.delete.mockRejectedValue(new Error(errors.ACCESS_DENIED))

    await expect(deleteTodoUseCaseMock.execute(todoDataToDelete)).rejects.toThrow(errors.ACCESS_DENIED)
  })
})
