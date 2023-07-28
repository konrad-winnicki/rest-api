import { Task } from "../../Task/Domain/Task";

export class User {
  readonly id: string;
  readonly name: string;
  readonly passwordHash: string;
  readonly tasks: Array<Task>;
  constructor(
    id: string,
    name: string,
    passwordHash: string,
    tasks: Array<Task>
  ) {
    this.id = id;
    this.name = name;
    this.passwordHash = passwordHash;
    this.tasks = tasks;
  }
}
