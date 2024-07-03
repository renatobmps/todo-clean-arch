import IUseCase from "@/core/shared/IUseCase";
import IUser from "../models/IUser";
import IUserRepository from "./IUserRepository";
import IPasswordCryptography from "./IPasswordCryptography";
import errors from "../../shared/errors";

export interface InputUserData {
  email: string,
  password: string
}

export default class LoginUser implements IUseCase<InputUserData, IUser> {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly cryptographyService: IPasswordCryptography
  ) { }

  async execute(user: InputUserData): Promise<IUser> {
    const dbUser = await this.usersRepository.readByEmail(user.email)

    if (!dbUser) {
      throw new Error(errors.USER_DONT_EXISTS)
    }

    const passwordMatch = this.cryptographyService.compare(user.password, dbUser.password!)

    if (!passwordMatch) {
      throw new Error(errors.INVALID_CREDENTIALS)
    }

    //Todo: Verificar a prop "password" está sendo retornada com algum valor no console.

    return { ...dbUser, password: undefined }
  }
}
