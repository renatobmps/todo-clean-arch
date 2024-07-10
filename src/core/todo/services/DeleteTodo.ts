import IUseCase from "@/core/shared/IUseCase";
import ITodoRepository from "./ITodoRepository";

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
      await this.todoRepository.delete(todo)

    } catch (error: any) {
      // console.error(`Error on delete to-do. todo id: ${todo.id}: `, error)
      throw new Error(error.message)
    }
  }
}
