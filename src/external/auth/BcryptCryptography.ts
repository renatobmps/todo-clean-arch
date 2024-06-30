import IPasswordCryptography from "@/core/user/services/IPasswordCryptography";
import bcrypt from "bcrypt"

export default class BcryptCryptography implements IPasswordCryptography {
  encrypt(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
  }
  compare(providedPass: string, savedPass: string): boolean {
    return bcrypt.compareSync(providedPass, savedPass)
  }
}
