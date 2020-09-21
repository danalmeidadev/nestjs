import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/getUser';
import { uuid } from 'uuidv4';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTaskFilterDTO } from './dtos/get-filter-dtos';
import { TaskEntity } from './entities/task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async getTasks(
    filterTasksDTO: GetTaskFilterDTO,
    user: User,
  ): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterTasksDTO, user);
  }

  async getTaskById(id: string, user: User): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async updateTask(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = this.taskRepository.delete({ id, userId: user.id });

    if ((await result).affected === 0) {
      throw new NotFoundException(
        'Ooops, você tentou excluir um usuario que não existe ou já foi deletado',
      );
    }
  }
}
