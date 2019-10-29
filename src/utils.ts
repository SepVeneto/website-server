import {Response} from 'express';
export function response(
  res: Response, 
  httpCode: number=500, 
  code: number=381, 
  message: string="服务端异常", 
  data: Object={}) {
    const responseData = {
      code,
      message,
      data,
    };
    res.status(httpCode).json(responseData);
  }