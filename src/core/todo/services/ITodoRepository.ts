import ITodo from "../models/ITodo";

export default interface ITodoRepository {
  create(data: ITodo): Promise<void>
  readAll(): Promise<ITodo[]>
}
