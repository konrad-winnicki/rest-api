import { InputTask } from "../../Task/Domain/InputTask";
import { Task } from "../../Task/Domain/Task";
import { TaskRepositoryInterface } from "./TaskRepositoryInterface";

export class TaskService {
  public taskRepositoryInterface: TaskRepositoryInterface;
  constructor(taskRepositoryInterface: TaskRepositoryInterface) {
    this.taskRepositoryInterface = taskRepositoryInterface;
  }

  createTask(userId: string, inputTask: InputTask): Promise<Task | null> {
    return this.taskRepositoryInterface.createTask(userId, inputTask);
  }

  getTasks(userId: string): Promise<Array<Task> | null> {
    return this.taskRepositoryInterface.readTasks(userId);
  }

  deleteTasks(userId: string, taskId: string): Promise<boolean> {
    return this.taskRepositoryInterface.deleteTask(userId, taskId);
  }

  updateStatus(
    userId: string,
    taskId: string,
    status: string
  ): Promise<boolean | null> {
    return this.taskRepositoryInterface.updateStatus(userId, taskId, status);
  }
}
