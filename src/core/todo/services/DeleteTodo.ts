import IUseCase from "@/core/shared/IUseCase";
import ITodoRepository from "./ITodoRepository";

export default class DeleteTodo implements IUseCase<string, void> {
  constructor(
    private readonly todoRepository: ITodoRepository
  ) { }

  async execute(id: string): Promise<void> {
    try {
      await this.todoRepository.delete(id)

    } catch (error: any) {
      console.error(`Error on delete to-do. todo id: ${id}: `, error)
      throw new Error(error.message)
    }
  }
}
