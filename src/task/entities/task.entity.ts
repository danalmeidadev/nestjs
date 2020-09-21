import { userInfo } from 'os';
import { User } from 'src/auth/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../task.status.enum';

@Entity('tasks')
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    onUpdate: 'current_timestamp',
  })
  updatedAt: Date;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { eager: false },
  )
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
