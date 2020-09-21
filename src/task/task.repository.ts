import { Inject } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './task.status.enum';
import { GetTaskFilterDTO } from './dtos/get-filter-dtos';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getTasks(
    filterTaskDto: GetTaskFilterDTO,
    user: User,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterTaskDto;
    const query = this.createQueryBuilder('task');
    query.where('tasks.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDTO;

    const task = new TaskEntity();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }
}
