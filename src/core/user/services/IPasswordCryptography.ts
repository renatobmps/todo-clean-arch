export default interface IPasswordCryptography {
  encrypt(password: string): Promise<string>,
  compare(providedPass: string, savedPass: string): Promise<boolean>
}
