import mongoose, { Model } from "mongoose";
import { Task } from "../../Task/Domain/Task";
import { TaskRepositoryInterface } from "../Application/TaskRepositoryInterface";
import { InputTask } from "../Domain/InputTask";
import { User } from "../../User/Domain/User";
import { TaskSorter } from "../../Task/Domain/TaskSorter";

const taskSorter = new TaskSorter();

export class MongoTaskRepository implements TaskRepositoryInterface {
  private UserModel: Model<User>;
  constructor(UserModel: Model<User>) {
    this.UserModel = UserModel;
  }

  public async readTasks(id: string): Promise<Array<Task> | null> {
    return this.UserModel.findById(id)
      .then((userExists) => {
        if (!userExists) {
          return null;
        }
        const unsortedTasks = userExists.tasks.map(
          (task) => new Task(task.id, task.name, task.deadline, task.status)
        );
        return taskSorter.sortTasksByDateAndStatus(unsortedTasks);
      })
      .catch((err) => {
        throw err;
      });
  }

  public async createTask(
    userId: string,
    inputTask: InputTask
  ): Promise<Task | null> {
    const taskId = new mongoose.Types.ObjectId();
    return this.UserModel.updateOne(
      { _id: userId },
      { $push: { tasks: { ...inputTask, _id: taskId } } }
    )
      .then((responseFromDB) => {
        return responseFromDB.modifiedCount != 0
          ? new Task(
              taskId.toString(),
              inputTask.name,
              inputTask.deadline,
              inputTask.status
            )
          : null;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteTask(userId: string, taskId: string): Promise<true | false> {
    return this.UserModel.updateOne(
      { _id: userId },
      { $pull: { tasks: { _id: taskId } } }
    )
      .then((responseFromDB) => {
        return responseFromDB.modifiedCount != 0 ? true : false;
      })
      .catch((err) => {
        throw err;
      });
  }

  private modifyStatus(status: string) {
    const update = { $set: { "tasks.$.status": status } };
    return { update };
  }

  public async updateStatus(
    userId: string,
    taskId: string,
    status: string
  ): Promise<true | false | null> {
    const updateData = this.modifyStatus(status);
    return this.UserModel.updateOne(
      { _id: userId, "tasks._id": taskId },
      updateData.update
    )

      .then((responseFromDB) => {
        if (
          responseFromDB.modifiedCount != 0 &&
          responseFromDB.matchedCount == 1
        ) {
          return true;
        }
        if (
          responseFromDB.modifiedCount == 0 &&
          responseFromDB.matchedCount == 1
        ) {
          return false;
        }
        return null;
      })
      .catch((err) => {
        throw err;
      });
  }
}
