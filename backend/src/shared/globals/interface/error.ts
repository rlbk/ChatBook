export interface IErrorResponse {
  message: string;
  statusCode: number;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}
