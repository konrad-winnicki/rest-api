import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { InputUser } from "../Domain/InputUser";
import { HttpResponse } from "../../Common/Infrastructure/HttpResponse";
import { UserService } from "../../User/Application/UserService";
import { User } from "../../User/Domain/User";
import sanitizedConfig from "../../config";

const tokenSignature = sanitizedConfig.TOKEN_SIGNATURE || "token_testing_signature";

export class UserController {
  private userService: UserService;
  private httpResponse: HttpResponse;
  constructor(userService: UserService, httpResponse: HttpResponse) {
    this.userService = userService;
    this.httpResponse = httpResponse;
  }

  public async createUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!("name" in req.body) || !("password" in req.body)) {
      return this.httpResponse.badRequest(res, {
        Bad_request: "Not valid data: name or password are required",
      });
    }

    const { name, password } = req.body;

    let userExists: User | null = null;
    try {
      userExists = await this.userService.findUserByName(name);
    } catch (err) {
      next(err);
    }

    if (userExists) {
      return this.httpResponse.conflict(res, { Conflict: "Already exists" });
    }

    const inputUser = await InputUser.runBeforeConstructor(name, password);
    try {
      const createdUser = await this.userService.createUser(inputUser);
      return createdUser
        ? this.httpResponse.created(res, { Created: createdUser.id })
        : this.httpResponse.internalServerError(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteUserController(req: Request, res: Response, next: NextFunction) {
    return req.body.userId !== req.params.id
      ? this.httpResponse.forbidden(res)
      : this.userService
          .deleteUser(req.params.id)
          .then((deletedUser) => {
            return deletedUser
              ? this.httpResponse.ok(res)
              : this.httpResponse.notFound(res);
          })
          .catch((err: Error) => {
            next(err);
          });
  }

  async loginController(req: Request, res: Response, next: NextFunction) {
    const { name, password } = req.body;
    let userExists: User | null = null;
    try {
      userExists = await this.userService.findUserByName(name);
    } catch (err) {
      next(err);
    }

    const correctLoginAndPassword = userExists
      ? await bcrypt.compare(password, userExists.passwordHash)
      : false;
    if (!userExists || !correctLoginAndPassword) {
      {
        return this.httpResponse.unauthorized(res);
      }
    }

    const tokenData = {
      id: userExists.id,
      name: userExists.name,
    };

    const token = jwt.sign(tokenData, tokenSignature, { expiresIn: 60 * 60 });
    return this.httpResponse.ok(res, { accessToken: token });
  }
}
