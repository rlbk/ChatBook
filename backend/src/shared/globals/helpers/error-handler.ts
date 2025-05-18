import HTTP_STATUS from 'http-status-codes';
import { IError } from '@globals/interface/error.interface';
import { STATUS } from '@globals/enums/status.enum';

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  /**
   * Serialize the error object into a format that can be sent to the client.
   * @returns An object containing the error message, status, and status code.
   */
  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = STATUS.ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = STATUS.ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class UnAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = STATUS.ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = STATUS.ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = STATUS.ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = STATUS.ERROR;

  constructor(message: string) {
    super(message);
  }
}
