import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Interval } from '@nestjs/schedule'; // 🚀 Mudamos de Cron para Interval
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { WorkoutPlan } from '../../workoutPlan/entities/workoutPlan.entity';

@Injectable()
export class ExpirationTask implements OnApplicationBootstrap {
  private readonly logger = new Logger(ExpirationTask.name);

  constructor(
    @InjectRepository(WorkoutPlan)
    private readonly workoutPlanRepository: Repository<WorkoutPlan>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log(
      'Servidor iniciado. Executando checagem inicial de planos...',
    );
    await this.checkAndExpirePlans();
  }

  @Interval(86400000)
  async handleIntervalPlans() {
    await this.checkAndExpirePlans();
  }

  private async checkAndExpirePlans() {
    this.logger.log('Iniciando varredura automatizada de planos expirados...');
    try {
      const now = new Date();

      const result = await this.workoutPlanRepository.update(
        {
          isActive: true,
          expiresAt: LessThan(now),
        },
        {
          isActive: false,
        },
      );

      this.logger.log(
        `Varredura finalizada. Total de ${result.affected} planos VNTEAM revogados.`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao rodar varredura de expiração: ${error.message}`,
      );
    }
  }
}
