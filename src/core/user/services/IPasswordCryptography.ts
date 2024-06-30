export default interface IPasswordCryptography {
  encrypt(password: string): string,
  compare(providedPass: string, savedPass: string): boolean
}
