import bcrypt from "bcrypt";

export class InputUser {
  readonly name: string;
  readonly passwordHash: string;
  private constructor(name: string, passwordHash: string) {
    this.name = name;
    this.passwordHash = passwordHash;
  }

  static async runBeforeConstructor(name: string, password: string) {
    return InputUser.hashPassword(password)
      .then((passwordHash) => {
        return new InputUser(name, passwordHash);
      })
      .catch((err) => {
        throw err;
      });
  }

  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
