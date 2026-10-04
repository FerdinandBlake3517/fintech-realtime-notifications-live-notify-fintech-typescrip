import assert from "node:assert/strict";
import { notificationFor } from "./notification_policy.js";

const declined = notificationFor({ accountId: "acct_1", paymentId: "pay_1", amountCents: 25, currency: "USD", status: "declined" });
assert.equal(declined.event, "payment.declined");
assert.equal(declined.data.reviewRequired, true);
const large = notificationFor({ accountId: "acct_1", paymentId: "pay_2", amountCents: 100000, currency: "USD", status: "authorized" });
assert.equal(large.event, "payment.authorized");
assert.equal(large.data.reviewRequired, true);
console.log("notification policy checks passed");
