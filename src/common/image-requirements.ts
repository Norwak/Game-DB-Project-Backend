import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";

export const imageRequirements = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024*1024 }),
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  ],
  fileIsRequired: false,
})