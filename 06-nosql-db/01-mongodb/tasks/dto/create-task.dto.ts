import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;
}
