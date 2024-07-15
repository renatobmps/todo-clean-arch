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
    try {
      const dbUser = await this.usersRepository.readByEmail(user.email)
      if (!dbUser) {
        throw new Error(errors.USER_DONT_EXISTS)
      }

      const passwordMatch = await this.cryptographyService.compare(user.password, dbUser.password!)
      if (!passwordMatch) {
        throw new Error(errors.INVALID_CREDENTIALS)
      }

      return { ...dbUser, password: undefined }

    } catch (error: any) {
      // console.error("Error durin user login: ", error)
      throw new Error(error.message)
    }
  }
}
