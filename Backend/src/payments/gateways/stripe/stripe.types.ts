// Stripe webhook event types relevant to payments
export const STRIPE_EVENT_PAYMENT_SUCCEEDED = 'payment_intent.succeeded';
export const STRIPE_EVENT_PAYMENT_FAILED = 'payment_intent.payment_failed';
export const STRIPE_EVENT_REFUND_CREATED = 'charge.refunded';

export interface StripePaymentIntentObject {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, string>;
}
