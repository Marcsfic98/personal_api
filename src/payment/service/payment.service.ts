import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { WorkoutPlan } from '../../workoutPlan/entities/workoutPlan.entity';

import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: any;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WorkoutPlan)
    private readonly workoutPlanRepository: Repository<WorkoutPlan>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  // Gera o link de checkout seguro do Stripe
  async createCheckoutSession(
    userId: number,
    userEmail: string,
    priceId: string,
  ) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: userId.toString(),
        customer_email: userEmail,
        // Envia o priceId via metadata para facilitar a leitura no Webhook posteriormente
        metadata: { priceId: priceId },
        success_url: 'http://localhost:5173/home?payment=success',
        cancel_url: 'http://localhost:5173/plans?payment=canceled',
      });

      return { url: session.url };
    } catch (error) {
      throw new Error(`Erro ao criar sessão do Stripe: ${error.message}`);
    }
  }

  // Regra de Negócio: Garante um plano ÚNICO por usuário (Cria ou Atualiza)
  async handleSuccessfulSubscription(userEmail: string, priceId: string) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      throw new NotFoundException(
        `Usuário com e-mail ${userEmail} não encontrado.`,
      );
    }

    const now = new Date();
    const expiresAt = new Date();
    let planName = 'Plano VNTEAM';

    // Configuração dos tempos dos planos baseados nos Price IDs do Stripe
    if (priceId === 'price_1TZzchBeGnwfkMwwWoTe336S') {
      expiresAt.setMonth(now.getMonth() + 1);
      planName = 'VNTEAM - Mensal';
    } else if (priceId === 'price_1TZzdZBeGnwfkMww6zYazlma') {
      expiresAt.setMonth(now.getMonth() + 4);
      planName = 'VNTEAM - 4 Meses';
    } else if (priceId === 'price_1TZzeIBeGnwfkMwwDsCgENDI') {
      expiresAt.setFullYear(now.getFullYear() + 1);
      planName = 'VNTEAM - Anual';
    }

    // Busca se o usuário já possui ALGUM plano na tabela, seja ativo ou inativo
    const currentPlan = await this.workoutPlanRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (currentPlan) {
      // Caso já possua, ATUALIZA o mesmo registro (Mantendo a unicidade)
      currentPlan.name = planName;
      currentPlan.isActive = true;
      currentPlan.activatedAt = now;
      currentPlan.expiresAt = expiresAt;
      return await this.workoutPlanRepository.save(currentPlan);
    } else {
      // Caso não possua nenhum, CRIA do zero
      const newPlan = this.workoutPlanRepository.create({
        name: planName,
        isActive: true,
        activatedAt: now,
        expiresAt: expiresAt,
        user: user,
      });
      return await this.workoutPlanRepository.save(newPlan);
    }
  }
}
