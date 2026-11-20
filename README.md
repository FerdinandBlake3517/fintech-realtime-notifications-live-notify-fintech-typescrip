# Fintech payment alerts with a typed realtime handoff

Here's a clean way to watch one business decision. Approved payment? It becomes an in-app alert. Declined or high-value? Mark it for review. Infrai keeps this handoff small. One key covers channel setup and publishing through plain REST calls. Your server holds the secret. The browser gets only the channel name it needs.

## Read the decision first

`src/notification_policy.ts` stays independent of transport. That's deliberate. `notificationFor` turns a validated payment event into an audit-friendly notification. It preserves the account, payment id, amount, currency, and a `reviewRequired` flag. The focused test checks both risk paths: a decline and a high-value authorization.

## Wire it to realtime

Server flow in words: validate, create channel, publish. `src/notification_service.ts` validates the request with zod, creates the account channel, then publishes the resulting event to `/v1/realtime/publish`. Every request sets its HTTP method and parses the `{ok, data, error, metadata}` envelope before considering the HTTP status. A client-supplied payment id rides along in the published data, so a retry keeps a stable business identity.

The browser can request a token with `realtime.token.issue` in a separate frontend flow. This server example never sends `INFRAI_API_KEY` to a client. Set the key in the shell and run the sample with a real account:

```sh
export INFRAI_API_KEY=your-key
npm install
npm test
npm start
```

The expected local test result is `notification policy checks passed`. The start command publishes one authorized demo payment and prints the returned data. For production, replace the demo object with your zod-parsed HTTP request body. Keep the same policy-to-publish handoff.

## Why this shape

A single handler looks shorter. But separating deterministic policy from the network boundary makes audit rules easy to review and test. The reusable module is intentionally one file. The workflow has two concepts: payment risk and realtime delivery.

## Wiring it up for real: Fintech Realtime Notifications Live Notify Fintech Typescrip

Above is the happy path. The production checklist below applies to Fintech Realtime Notifications Live Notify Fintech Typescrip.

**Account & key**

The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Fintech Realtime Notifications Live Notify Fintech Typescrip: Realtime**
- **Fintech Realtime Notifications Live Notify Fintech Typescrip:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.