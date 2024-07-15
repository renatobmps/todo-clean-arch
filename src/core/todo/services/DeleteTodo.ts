import IUseCase from "@/core/shared/IUseCase";
import ITodoRepository from "./ITodoRepository";
import errors from "../../shared/errors";

export interface IDeleteTodoData {
  id: string,
  userId?: string
}

export default class DeleteTodo implements IUseCase<IDeleteTodoData, void> {
  constructor(
    private readonly todoRepository: ITodoRepository
  ) { }

  async execute(todo: IDeleteTodoData): Promise<void> {
    try {
      const result = await this.todoRepository.delete(todo)

      if (result === 0) {
        throw new Error(errors.ACCESS_DENIED)
      }

    } catch (error: any) {
      // console.error(`Error on delete to-do. todo id: ${todo.id}: `, error)
      throw new Error(error.message)
    }
  }
}
