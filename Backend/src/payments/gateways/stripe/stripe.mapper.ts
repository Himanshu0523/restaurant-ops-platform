import { GatewayPaymentResult } from '../../interfaces/payment-gateway.interface.js';
import {
  StripePaymentIntentObject,
} from './stripe.types.js';

export function mapStripePaymentIntent(
  intent: StripePaymentIntentObject,
): GatewayPaymentResult {
  return {
    gatewayPaymentId: intent.id,
    status: intent.status,
    raw: intent as unknown as Record<string, unknown>,
  };
}
