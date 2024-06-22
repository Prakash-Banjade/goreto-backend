import { Controller, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) { }

  // TODO: REMOVE THIS LATER ON PRODUCTION
  @Get('indents')
  async getPaymentIndents() {
    return this.stripeService.getPaymentIndents();
  }

}
