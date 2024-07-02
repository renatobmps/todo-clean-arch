import IUseCase from "@/core/shared/IUseCase";
import IUser from "../models/IUser";
import IUserRepository from "./IUserRepository";
import errors from "../../shared/errors";
import IPasswordCryptography from "./IPasswordCryptography";

export default class RegisterUser implements IUseCase<IUser, void> {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly cryptographyService: IPasswordCryptography
  ) { }

  async execute(user: IUser): Promise<void> {
    const isUserExists = await this.usersRepository.readByEmail(user.email)

    if (isUserExists) {
      throw new Error(errors.USER_EXISTS)
    }

    const passwordEncrypted = this.cryptographyService.encrypt(user.password!)

    const newUser: IUser = {
      name: user.name,
      email: user.email,
      password: passwordEncrypted
    }

    await this.usersRepository.create(newUser)
  }
}
