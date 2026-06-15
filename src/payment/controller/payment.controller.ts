import {
    Body,
    Controller,
    Headers,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

// 🚀 CORREÇÃO AQUI: Importa usando o padrão de namespace (import * as)
import * as express from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout')
  async createCheckout(
    @Body() body: any, // Captura o body inteiro temporariamente
  ) {
    // 🚀 Dê esse log para ver o que o React está de fato entregando
    console.log('DADOS VINDOS DO FRONT-END:', body);

    return await this.paymentService.createCheckoutSession(
      body.userId,
      body.userEmail,
      body.priceId,
    );
  }

  @Post('webhook')
  async stripeWebhook(
    // 🚀 CORREÇÃO AQUI: Passa a tipagem através do objeto express
    @Req() req: express.Request,
    @Headers('stripe-signature') signature: string,
    @Res() res: express.Response,
  ) {
    const event = req.body;

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userEmail = session.customer_details?.email;
        const priceId = session.metadata?.priceId;

        if (userEmail && priceId) {
          await this.paymentService.handleSuccessfulSubscription(
            userEmail,
            priceId,
          );
        }
      }

      return res.status(HttpStatus.OK).json({ received: true });
    } catch (err) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }
  }
}
