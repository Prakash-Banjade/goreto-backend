import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });
      return paymentIntent;
    } catch (e) {
      console.log(e)
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (e) {
      console.log(e)
      throw new BadRequestException('Failed to confirm payment intent');
    }
  }

  async getPaymentIndents() {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list();
      return paymentIntents;
    } catch (e) {
      throw new BadRequestException('Failed to get payment intents');
    }
  }
}
