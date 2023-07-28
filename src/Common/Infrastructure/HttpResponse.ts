import { Response } from "express";

enum httpStatus {
  CREATED = 201,
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  FAILED = 412,
  INTERNAL_SERVER_ERROR = 500,
}

type Data = {
  [key: string]: string | object;
};

export class HttpResponse {
  public ok(res: Response, data?: Data) {
    return res.status(httpStatus.OK).json(data);
  }
  public created(res: Response, data?: Data) {
    return res.status(httpStatus.CREATED).json(data);
  }

  public notFound(res: Response, data?: Data) {
    return res.status(httpStatus.NOT_FOUND).json(data);
  }

  public conflict(res: Response, data?: Data) {
    return res.status(httpStatus.CONFLICT).json(data);
  }
  public badRequest(res: Response, data?: Data) {
    return res.status(httpStatus.BAD_REQUEST).json(data);
  }

  public unauthorized(res: Response, data?: Data) {
    return res.status(httpStatus.UNAUTHORIZED).json(data);
  }
  public internalServerError(res: Response, data?: Data) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(data);
  }
  public failed(res: Response, data?: Data) {
    return res.status(httpStatus.FAILED).json(data);
  }

  public forbidden(res: Response, data?: Data) {
    return res.status(httpStatus.FORBIDDEN).json(data);
  }
}
