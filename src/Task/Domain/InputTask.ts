export class InputTask {
  readonly name: string;
  readonly deadline: Date | null;
  readonly status: string;
  constructor(name: string, date: string, time: string, status: string) {
    this.name = name;
    this.status = status;
    this.deadline = this.transformDate(date, time);
  }

  private transformDate(date: string, time: string): Date | null {
    const deadline = date != "" ? new Date(`${date}:${time}Z`) : null;
    return deadline;
  }
}
