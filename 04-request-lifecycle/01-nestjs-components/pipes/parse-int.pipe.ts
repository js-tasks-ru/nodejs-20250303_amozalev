import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const num = parseInt(value);
    if (!isNaN(num)) {
      return num;
    }

    throw new BadRequestException(`"${value}" не является числом`);
  }
}
