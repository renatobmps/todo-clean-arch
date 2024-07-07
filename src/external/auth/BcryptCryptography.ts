import IPasswordCryptography from "@/core/user/services/IPasswordCryptography";
import bcrypt from "bcrypt"

export default class BcryptCryptography implements IPasswordCryptography {
  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
  }

  async compare(providedPass: string, savedPass: string): Promise<boolean> {
    return await bcrypt.compare(providedPass, savedPass)
  }
}
