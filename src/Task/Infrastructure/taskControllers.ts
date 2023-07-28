import { InputTask } from "../Domain/InputTask";
import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../../Common/Infrastructure/HttpResponse";
import { TaskService } from "../../Task/Application/TaskService";

export class TaskController {
  private taskService: TaskService;
  private httpResponse: HttpResponse;
  constructor(taskService: TaskService, httpResponse: HttpResponse) {
    this.taskService = taskService;
    this.httpResponse = httpResponse;
  }

  createTaskController(req: Request, res: Response, next: NextFunction) {
    if (
      !("name" in req.body) ||
      !("date" in req.body) ||
      !("time" in req.body)
    ) {
      return this.httpResponse.badRequest(res, {
        Bad_request: "Not valid data: name, date and time are required",
      });
    }
    const { name, date, time } = req.body;
    const inputTask = new InputTask(name, date, time, "pending");
    this.taskService
      .createTask(req.body.userId, inputTask)
      .then((task) => {
        if (task) {
          return this.httpResponse.created(res, { Created: { ...task } });
        } else {
          return this.httpResponse.failed(res, { Error: "task not created" });
        }
      })
      .catch((err: Error) => {
        next(err);
      });
  }

  getTaskController(req: Request, res: Response, next: NextFunction) {
    this.taskService
      .getTasks(req.body.userId)
      .then((tasks) => {
        if (!tasks) {
          return this.httpResponse.unauthorized(res);
        }
        return this.httpResponse.ok(res, { Tasks: tasks });
      })
      .catch((err: Error) => {
        next(err);
      });
  }

  deleteTaskController(req: Request, res: Response, next: NextFunction) {
    this.taskService
      .deleteTasks(req.body.userId, req.params.id)
      .then((response) => {
        if (response) {
          return this.httpResponse.ok(res);
        }
        return this.httpResponse.notFound(res);
      })
      .catch((error: Error) => {
        next(error);
      });
  }

  updateTaskController(req: Request, res: Response, next: NextFunction) {
    this.taskService
      .updateStatus(req.body.userId, req.params.id, "accomplished")
      .then((response) => {
        if (response) {
          return this.httpResponse.ok(res);
        }
        if (response == false) {
          return this.httpResponse.conflict(res, {
            Error: "Task is accomplished",
          });
        }

        return this.httpResponse.notFound(res);
      })
      .catch((error: Error) => {
        next(error);
      });
  }
}

