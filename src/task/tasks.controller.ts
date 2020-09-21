import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/getUser';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTaskFilterDTO } from './dtos/get-filter-dtos';
import { TaskEntity } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskStatus } from './task.status.enum';
import { TaskStatusValidationPipe } from './pipes/task.status.pipe';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterTaskDTO: GetTaskFilterDTO,
    @GetUser() user: User,
  ) {
    return this.taskService.getTasks(filterTaskDTO, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDTO, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.updateTask(id, status, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }
}
