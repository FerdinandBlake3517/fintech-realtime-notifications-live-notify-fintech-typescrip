export type PaymentEvent = { accountId: string; paymentId: string; amountCents: number; currency: string; status: "authorized" | "declined" };
export type Notification = { account_id: string; event: "payment.authorized" | "payment.declined"; data: { paymentId: string; amountCents: number; currency: string; reviewRequired: boolean } };

export function notificationFor(payment: PaymentEvent): Notification {
  return {
    account_id: payment.accountId,
    event: payment.status === "declined" ? "payment.declined" : "payment.authorized",
    data: {
      paymentId: payment.paymentId,
      amountCents: payment.amountCents,
      currency: payment.currency,
      reviewRequired: payment.status === "declined" || payment.amountCents >= 100000
    }
  };
}
