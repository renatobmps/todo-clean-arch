import IUseCase from "@/core/shared/IUseCase";
import IUser from "../models/IUser";
import IUserRepository from "./IUserRepository";
import IPasswordCryptography from "./IPasswordCryptography";
import errors from "../../shared/errors";
import emailValidation from "../utils/emailValidation";
import passwordValidation from "../utils/passwordValidation";

export default class RegisterUser implements IUseCase<IUser, void> {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly cryptographyService: IPasswordCryptography
  ) { }

  async execute(user: IUser): Promise<void> {
    try {
      const isUserExists = await this.usersRepository.readByEmail(user.email)
      if (isUserExists) {
        throw new Error(errors.USER_EXISTS)
      }

      if (!user.name || user.name.trim() === "") {
        throw new Error(errors.INVALID_USER_NAME)
      }

      if (!user.email || user.email.trim() === "" || !emailValidation(user.email)) {
        throw new Error(errors.INVALID_USER_EMAIL)
      }

      if (!user.password || user.password.trim() === "" || !passwordValidation(user.password)) {
        throw new Error(errors.INVALID_USER_PASSWORD)
      }

      const passwordEncrypted = await this.cryptographyService.encrypt(user.password!)

      const newUser: IUser = {
        name: user.name,
        email: user.email,
        password: passwordEncrypted
      }

      await this.usersRepository.create(newUser)

    } catch (error: any) {
      console.error("Error during user registration: ", error)
      throw new Error(error.message)
    }
  }
}
