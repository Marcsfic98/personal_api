import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWorkoutSession } from './../entities/userWorkoutSession.entity';

@Injectable()
export class UserWorkoutSessionService {
  constructor(
    @InjectRepository(UserWorkoutSession)
    private userWorkoutSessionRepository: Repository<UserWorkoutSession>,
  ) {}

  async findAll(): Promise<UserWorkoutSession[]> {
    return await this.userWorkoutSessionRepository.find();
  }

  async findById(id: number): Promise<UserWorkoutSession> {
    const UserWorkoutSession = await this.userWorkoutSessionRepository.findOne({
      where: { id },
    });
    if (!UserWorkoutSession) {
      throw new Error('UserWorkoutSession not found');
    }
    return UserWorkoutSession;
  }

  async create(
    userWorkoutSession: UserWorkoutSession,
  ): Promise<UserWorkoutSession> {
    return await this.userWorkoutSessionRepository.save(userWorkoutSession);
  }

  async update(
    userWorkoutSession: UserWorkoutSession,
  ): Promise<UserWorkoutSession> {
    await this.findById(userWorkoutSession.id);
    return await this.userWorkoutSessionRepository.save(userWorkoutSession);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.userWorkoutSessionRepository.delete(id);
  }
}
