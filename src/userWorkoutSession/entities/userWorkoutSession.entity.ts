import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_workout_sessions')
export class UserWorkoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}
