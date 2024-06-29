import IUseCase from "@/core/shared/IUseCase";
import IUser from "../models/IUser";
import IUserRepository from "./IUserRepository";
import errors from "../../shared/errors";

export default class RegisterUser implements IUseCase<IUser, void> {
  constructor(
    // private readonly cryptographyProvider: any,
    private readonly usersRepository: IUserRepository
  ) { }

  async execute(user: IUser): Promise<void> {
    const isUserExists = await this.usersRepository.readByEmail(user.email)

    if (isUserExists) {
      throw new Error(errors.USER_EXISTS)
    }


    const newUser: IUser = {
      name: user.name,
      email: user.email,
      password: user.password
    }

    return await this.usersRepository.create(newUser)
  }
}
