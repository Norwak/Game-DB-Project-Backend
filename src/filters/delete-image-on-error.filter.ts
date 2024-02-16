import { isArray } from 'lodash';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch(BadRequestException)
export class DeleteImageOnErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    


    const getFiles = (files: Express.Multer.File[]): Express.Multer.File[] => {
      if (!files) return [];
      if (isArray(files)) return files;
      return Object.values(files);
    };

    let filePaths: Express.Multer.File[];
    if (request.files) {
      filePaths = getFiles(request.files as Express.Multer.File[]);
    } else {
      filePaths = getFiles([request.file as Express.Multer.File]);
    }

    for (const file of filePaths) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
    }
    response.status(status).json(exception.getResponse());
  }
}