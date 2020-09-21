import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    const valueStatus = value.toUpperCase();

    if (!this.isStatusValid(valueStatus)) {
      throw new BadRequestException(`"${valueStatus}" não é um status valido`);
    }

    return valueStatus;
  }

  private isStatusValid(status: TaskStatus) {
    const index = this.allowedStatus.indexOf(status);
    return index !== -1;
  }
}
