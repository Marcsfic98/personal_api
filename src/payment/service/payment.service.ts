import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { WorkoutPlan } from '../../workoutPlan/entities/workoutPlan.entity';

@Injectable()
export class PaymentService {
  // 🚀 CORREÇÃO DEFINITIVA: Força o TS a ler como o tipo da instância da classe Stripe
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WorkoutPlan)
    private readonly workoutPlanRepository: Repository<WorkoutPlan>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }
  constructStripeEvent(rawBody: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  }

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
        metadata: { priceId: priceId }, // Enviamos o priceId aqui para o Webhook ler depois
        success_url: 'http://localhost:5173/home?payment=success',
        cancel_url: 'http://localhost:5173/plans?payment=canceled',
      });

      return { url: session.url };
    } catch (error) {
      throw new Error(`Erro ao criar sessão do Stripe: ${error.message}`);
    }
  }

  async handleSuccessfulSubscription(userEmail: string, priceId: string) {
    // 💡 Busca apenas os dados estritamente necessários, sem joins pesados
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuário com e-mail ${userEmail} não encontrado no banco de dados.`,
      );
    }

    const now = new Date();
    const expiresAt = new Date();
    let planName = 'Plano VNTEAM';

    // Definição de durações com base nos IDs reais de preço do seu Stripe
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

    // Procura se o usuário já tem um plano cadastrado
    const currentPlan = await this.workoutPlanRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (currentPlan) {
      currentPlan.name = planName;
      currentPlan.isActive = true;
      currentPlan.activatedAt = now;
      currentPlan.expiresAt = expiresAt;

      console.log(
        `🔄 [UPDATE] Atualizando plano existente para o usuário ID ${user.id}`,
      );
      return await this.workoutPlanRepository.save(currentPlan);
    } else {
      const newPlan = this.workoutPlanRepository.create({
        name: planName,
        isActive: true,
        activatedAt: now,
        expiresAt: expiresAt,
        user: { id: user.id }, // Vincula a Foreign Key de forma limpa pelo ID
      });

      console.log(
        `✨ [INSERT] Gravando novo plano para o usuário ID ${user.id}`,
      );
      return await this.workoutPlanRepository.save(newPlan);
    }
  }
}
