import IUseCase from "@/core/shared/IUseCase"
import ITodo from "../models/ITodo"
import ITodoRepository from "./ITodoRepository"

export default class UpdateTodo implements IUseCase<ITodo, void> {
  constructor(
    private readonly todoRepository: ITodoRepository
  ) { }

  async execute(todo: ITodo): Promise<void> {
    try {
      await this.todoRepository.update(todo)

    } catch (error: any) {
      console.error(`Error during update to-do id: ${todo.id} from user id: ${todo.userId}: `, error)
      throw new Error(error.message)
    }
  }
}
