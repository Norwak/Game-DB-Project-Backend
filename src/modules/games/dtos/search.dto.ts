import { Expose } from "class-transformer";

export class SearchDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  releaseDate: Date;

  @Expose()
  imagePath: string;
}