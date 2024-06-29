import IUseCase from "@/core/shared/IUseCase";
import IUser from "../models/IUser";

export default class RegisterUser implements IUseCase<IUser, void> {
  constructor(
    private readonly cryptographyProvider: any,
    private readonly usersRepository: any
  ) { }

  execute(args: IUser): void {
    throw new Error("Method not implemented.");
  }
}