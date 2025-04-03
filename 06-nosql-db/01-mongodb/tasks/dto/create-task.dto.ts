import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export enum Prioriry {
  MINOR = "Minor",
  NORMAL = "Normal",
  MAJOR = "Major",
  CRITICAL = "Critical",
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsEnum(Prioriry)
  priority: Prioriry;

  @IsOptional()
  @IsBoolean()
  isCompleted: boolean;
}
