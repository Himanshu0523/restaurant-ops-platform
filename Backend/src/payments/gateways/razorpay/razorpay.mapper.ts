import { GatewayPaymentResult } from '../../interfaces/payment-gateway.interface.js';
import { RazorpayPaymentObject } from './razorpay.types.js';

export function mapRazorpayPayment(
  payment: RazorpayPaymentObject,
): GatewayPaymentResult {
  return {
    gatewayOrderId: payment.order_id,
    gatewayPaymentId: payment.id,
    status: payment.status,
    raw: payment as unknown as Record<string, unknown>,
  };
}
