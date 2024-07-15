import IUseCase from "@/core/shared/IUseCase";
import ITodo from "../models/ITodo";
import ITodoRepository from "./ITodoRepository";

export default class ReadTodosByUserId implements IUseCase<string, ITodo[]> {
  constructor(
    private readonly todoRepository: ITodoRepository,
  ) { }

  async execute(userId: string): Promise<ITodo[]> {
    try {
      const response = await this.todoRepository.readTodosByUserId(userId)

      if (!response) {
        return []
      }

      return response

    } catch (error: any) {
      // console.error(`Error during reading to-dos for user ${userId}: `, error)
      throw new Error(error.message)
    }
  }
}
