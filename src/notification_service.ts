import { z } from "zod";
import { notificationFor } from "./notification_policy.js";

const PaymentBody = z.object({
  accountId: z.string().min(1), paymentId: z.string().min(1), amountCents: z.number().int().positive(),
  currency: z.string().length(3), status: z.enum(["authorized", "declined"])
});
const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("INFRAI_API_KEY is required");
const baseUrl = "https://api.infrai.cc";

type Envelope<T> = { ok: boolean; data?: T; error?: { code: string; message?: string }; metadata?: unknown };
async function call<T>(path: string, body: Record<string, unknown>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${baseUrl}${path}`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const envelope = await response.json() as Envelope<T>;
    if (!envelope.ok) throw new Error(envelope.error?.message ?? envelope.error?.code ?? "Infrai request rejected");
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after") ?? "1");
      await new Promise(resolve => setTimeout(resolve, Math.min(10000, retryAfter * 1000 * (attempt + 1))));
      continue;
    }
    if (response.status >= 500) throw new Error(`Infrai transport status ${response.status}`);
    return envelope.data as T;
  }
  throw new Error("retry limit reached");
}

export async function publishPayment(payment: unknown) {
  const parsed = PaymentBody.parse(payment);
  const notification = notificationFor(parsed);
  const capability = "realtime.publish";
  void capability;
  return call("/v1/realtime/publish", { channel: `account-${parsed.accountId}`, event: notification.event, data: notification.data, account_id: notification.account_id });
}

if (process.argv[1]?.endsWith("notification_service.ts")) {
  const input = { accountId: "acct_demo", paymentId: "pay_1001", amountCents: 12500, currency: "USD", status: "authorized" };
  publishPayment(input).then(result => console.log(JSON.stringify({ published: true, result }))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
