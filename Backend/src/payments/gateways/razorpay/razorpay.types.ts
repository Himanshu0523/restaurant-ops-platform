// Razorpay webhook event types
export const RAZORPAY_EVENT_PAYMENT_AUTHORIZED = 'payment.authorized';
export const RAZORPAY_EVENT_PAYMENT_CAPTURED = 'payment.captured';
export const RAZORPAY_EVENT_PAYMENT_FAILED = 'payment.failed';
export const RAZORPAY_EVENT_REFUND_CREATED = 'refund.created';
export const RAZORPAY_EVENT_REFUND_PROCESSED = 'refund.processed';

export interface RazorpayPaymentObject {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  error_code?: string;
  error_description?: string;
}

export interface RazorpayOrderObject {
  id: string;
  receipt: string;
  amount: number;
  currency: string;
  status: string;
}
