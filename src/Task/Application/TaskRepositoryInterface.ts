import { InputTask } from "../Domain/InputTask";
import { Task } from "../../Task/Domain/Task";

export interface TaskRepositoryInterface {
  createTask(userId: string, inputTask: InputTask): Promise<Task | null>;
  deleteTask(userId: string, taskId: string): Promise<boolean>;
  updateStatus(
    userId: string,
    taskId: string,
    status: string
  ): Promise<boolean | null>;
  readTasks(userId: string): Promise<Array<Task> | null>;
}
