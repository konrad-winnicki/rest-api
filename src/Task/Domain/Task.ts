export class Task {
  readonly id: string;
  readonly name: string;
  readonly deadline: Date | null;
  readonly status: string;
  constructor(id: string, name: string, deadline: Date | null, status: string) {
    this.id = id;
    this.name = name;
    this.deadline = deadline;
    this.status = status;
  }

  public getTaskDetails() {
    return {
      id: this.id,
      name: this.name,
      deadline: this.deadline,
      status: this.status,
    };
  }
}
