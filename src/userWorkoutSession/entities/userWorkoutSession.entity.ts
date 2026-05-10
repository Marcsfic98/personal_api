import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutDay } from '../../workoutDay/entities/workoutDay.entity';

@Entity('user_workout_sessions')
export class UserWorkoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => WorkoutDay, (workoutDay) => workoutDay.userWorkoutSessions, {
    onDelete: 'CASCADE',
  })
  workoutDay: WorkoutDay;
}
