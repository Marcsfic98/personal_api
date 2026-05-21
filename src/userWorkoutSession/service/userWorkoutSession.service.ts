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
    return await this.userWorkoutSessionRepository.find({
      relations: ['user'],
    });
  }

  async findById(id: number): Promise<UserWorkoutSession> {
    const userWorkoutSession = await this.userWorkoutSessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!userWorkoutSession) {
      throw new Error('UserWorkoutSession not found');
    }
    return userWorkoutSession;
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

  /**
   * NOVO MÉTODO: Retorna o mapa de consistência do usuário formatado em YYYY-MM-DD
   */
  async getConsistencyMap(
    userId: number,
  ): Promise<Record<string, 'started' | 'completed' | 'not_started'>> {
    // Busca apenas as colunas necessárias para ganhar performance
    const sessions = await this.userWorkoutSessionRepository.find({
      where: { user: { id: userId } },
      select: ['startedAt', 'completedAt'],
      order: { startedAt: 'ASC' },
    });

    const consistencyMap: Record<
      string,
      'started' | 'completed' | 'not_started'
    > = {};

    sessions.forEach((session) => {
      if (!session.startedAt) return;

      // Extrai apenas 'YYYY-MM-DD' da data UTC salvando o fuso de forma segura
      const dateStr = new Date(session.startedAt).toISOString().split('T')[0];

      if (session.completedAt) {
        // Se foi finalizado, vira concluído independente de outras sessões abertas no mesmo dia
        consistencyMap[dateStr] = 'completed';
      } else {
        // Se foi iniciado e o dia ainda não possui nenhum status de "completed", vira "started"
        if (consistencyMap[dateStr] !== 'completed') {
          consistencyMap[dateStr] = 'started';
        }
      }
    });

    return consistencyMap;
  }
}
