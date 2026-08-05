import {
    BadRequestException,
    Body,
    Controller,
    Headers,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from '../service/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout')
  async createCheckout(@Body() body: any) {
    console.log('📦 DADOS VINDOS DO FRONT-END:', body);
    return await this.paymentService.createCheckoutSession(
      body.userId,
      body.userEmail,
      body.priceId,
    );
  }

  @Post('webhook')
  async stripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    if (!signature) {
      throw new BadRequestException('Faltando o cabeçalho stripe-signature');
    }

    try {
      // 🚀 Captura o buffer bruto disponibilizado pelo NestJS
      const rawBody = (req as any).rawBody;

      if (!rawBody) {
        console.error('❌ Erro: rawBody não foi populado. Verifique o main.ts');
        throw new BadRequestException('Não foi possível ler o Raw Body.');
      }

      const event = this.paymentService.constructStripeEvent(
        rawBody,
        signature,
      );

      console.log(`⚡ Evento recebido do Stripe: ${event.type}`);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;

        const userEmail = session.customer_details?.email;
        const priceId = session.metadata?.priceId;

        console.log(
          `💰 Checkout completo detectado para o e-mail: ${userEmail}`,
        );

        if (userEmail && priceId) {
          const resultado =
            await this.paymentService.handleSuccessfulSubscription(
              userEmail,
              priceId,
            );
          console.log('✅ PLANO SALVO COM SUCESSO NO BANCO:', resultado);
        } else {
          console.warn(
            '⚠️ Webhook ignorado: Faltando userEmail ou priceId nos metadados',
          );
        }
      }

      // Retorna 200 para o Stripe saber que o evento foi processado
      return res.status(HttpStatus.OK).json({ received: true });
    } catch (err) {
      console.error(
        `❌ Erro de validação/processamento no Webhook: ${err.message}`,
      );
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }
  }
}
