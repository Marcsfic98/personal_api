import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { WorkoutPlan } from './../entities/workoutPlan.entity';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private workoutRepository: Repository<WorkoutPlan>,
  ) {}

  async findAll(): Promise<WorkoutPlan[]> {
    return await this.workoutRepository.find({
      relations: ['workoutDays', 'workoutDays.WorkoutExercice', 'user'],
    });
  }

  async findById(id: number): Promise<WorkoutPlan> {
    const WorkoutPlan = await this.workoutRepository.findOne({
      where: { id },
      relations: ['workoutDays', 'workoutDays.WorkoutExercice', 'user'],
    });

    if (!WorkoutPlan) {
      throw new HttpException(
        'Plano de treino não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return WorkoutPlan;
  }

  async findByName(name: string): Promise<WorkoutPlan[]> {
    return await this.workoutRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ['workoutDays', 'workoutDays.WorkoutExercice', 'user'],
    });
  }

  async create(workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
    return await this.workoutRepository.save(workoutPlan);
  }

  async update(workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
    await this.findById(workoutPlan.id);
    return await this.workoutRepository.save(workoutPlan);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.workoutRepository.delete(id);
  }
}
