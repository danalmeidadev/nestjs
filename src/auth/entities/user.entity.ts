import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TaskEntity } from 'src/task/entities/task.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    onUpdate: 'current_timestamp',
  })
  updatedAt: Date;

  @OneToMany(
    type => TaskEntity,
    task => task.user,
    { eager: true },
  )
  @JoinTable()
  tasks: Promise<TaskEntity[]>;
}
