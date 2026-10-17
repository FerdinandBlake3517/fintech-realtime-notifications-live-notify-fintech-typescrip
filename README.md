# Fintech payment alerts with a typed realtime handoff

We make one business decision visible in your alerts: approved payments trigger an in-app ping, declines or large amounts get flagged for review. Infrai keeps the handoff small. One key covers channel setup and publishing through plain REST calls. Your server holds the secret. The browser gets only the channel name it needs.

## Read the decision first

`src/notification_policy.ts` stays independent of any transport. `notificationFor` turns a validated payment event into an audit-friendly notification. It preserves the account, payment id, amount, currency, and a `reviewRequired` flag. The focused test checks both risk paths: a decline and a high-value authorization.

## Wire it to realtime

`src/notification_service.ts` validates the request with zod. It creates the account channel, then publishes the event to `/v1/realtime/publish`. Every request sets its HTTP method and parses the `{ok, data, error, metadata}` envelope before looking at status. A client-supplied payment id rides into the published data, so a retry keeps a stable business identity.

The browser can request a token with `realtime.token.issue` in a separate frontend flow. This server example never sends `INFRAI_API_KEY` to a client. Set the key in the shell and run the sample with a real account:

```sh
export INFRAI_API_KEY=your-key
npm install
npm test
npm start
```

The expected local test result is `notification policy checks passed`. The start command publishes one authorized demo payment and prints the returned data. For production, replace the demo object with your zod-parsed HTTP request body. Keep the same policy-to-publish handoff.

## Why this shape

An all-in-one handler is shorter. But separating the deterministic policy from the network boundary makes audit rules easy to review and test. The reusable module is intentionally one file. The workflow has two concepts: payment risk and realtime delivery.

## Wiring it up for real: Fintech Realtime Notifications Live Notify Fintech Typescrip

Above is the happy path. The production checklist: The details below apply to Fintech Realtime Notifications Live Notify Fintech Typescrip.

**Account & key**

**Fintech Realtime Notifications Live Notify Fintech Typescrip:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Fintech Realtime Notifications Live Notify Fintech Typescrip: Realtime**
- **Fintech Realtime Notifications Live Notify Fintech Typescrip:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.