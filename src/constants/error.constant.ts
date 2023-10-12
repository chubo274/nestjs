import { HttpException, HttpStatus, Logger } from '@nestjs/common';

interface BaseErrorFormat {
  errCode: string;
  statusCode: number;
  message: string;
}
export class BaseException extends HttpException {
  constructor(response: BaseErrorFormat, cause?: any) {
    super(response, response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    this.stack = cause;
  }
}

// Define Errors
type keyErrors =
  'DEFAULT' |
  'ITEM_NOT_FOUND' |
  'BAD_REQUEST' |
  'ITEM_EXISTED' |
  'FORBIDDEN'

type IErrors = {
  [key in keyErrors]: (data?: any) => BaseErrorFormat;
};

export const Errors: IErrors = {
  DEFAULT: () => ({
    errCode: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
  }),

  ITEM_NOT_FOUND: (message?: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ? message : `item does not exists!`,
  }),

  BAD_REQUEST: (message?: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ? message : 'BAD_REQUEST',
  }),

  ITEM_EXISTED: (message?: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ? message : `item has existed!`,
  }),

  FORBIDDEN: (message?: string) => ({
    errCode: HttpStatus.FORBIDDEN.toString(),
    statusCode: HttpStatus.FORBIDDEN,
    message: message ? message : 'Forbidden resource',
  }),
};

