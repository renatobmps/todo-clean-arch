import ITodo from "../models/ITodo";
import { IDeleteTodoData } from "./DeleteTodo";

export default interface ITodoRepository {
  create(data: ITodo): Promise<void>
  readTodosByUserId(userId: string): Promise<ITodo[]>
  update(todo: ITodo): Promise<void>
  delete(todo: IDeleteTodoData): Promise<number>
}
