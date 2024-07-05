import IUseCase from "@/core/shared/IUseCase";
import ITodo from "../models/ITodo";
import ITodoRepository from "./ITodoRepository";

export default class ReadTodosByUserId implements IUseCase<string, ITodo[]> {
  constructor(
    private readonly todoRepository: ITodoRepository
  ) { }

  async execute(userId: string): Promise<ITodo[]> {
    try {
      return await this.todoRepository.readTodosByUserId(userId)
    } catch (error) {
      console.error('Error executing ReadAllByUserIdUseCase', error)
      throw error
    }
  }
}
