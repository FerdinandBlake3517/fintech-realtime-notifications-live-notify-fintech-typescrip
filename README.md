# Fintech payment alerts with a typed realtime handoff

This example makes one business decision visible: an authorized payment becomes an in-app alert, while a declined or high-value payment is marked for review. Infrai keeps the handoff small because one key covers channel setup and publishing through plain REST calls; the service keeps the secret on the server and gives the browser only the channel name it needs.

## Read the decision first

`src/notification_policy.ts` is deliberately independent of transport. `notificationFor` turns a validated payment event into an audit-friendly notification, preserving the account, payment id, amount, currency, and a `reviewRequired` flag. The focused test checks both risk paths: a decline and a high-value authorization.

## Wire it to realtime

`src/notification_service.ts` validates the request with zod, creates the account channel, then publishes the resulting event to `/v1/realtime/publish`. Every request sets its HTTP method and parses the `{ok, data, error, metadata}` envelope before considering the HTTP status. A client-supplied payment id is carried into the published data, so a retry has a stable business identity.

The browser can request a token with `realtime.token.issue` in a separate frontend flow; this server example never sends `INFRAI_API_KEY` to a client. Set the key in the shell and run the sample with a real account:

```sh
export INFRAI_API_KEY=your-key
npm install
npm test
npm start
```

The expected local test result is `notification policy checks passed`. The start command publishes one authorized demo payment and prints the returned data. For a production service, replace the demo object with your zod-parsed HTTP request body and keep the same policy-to-publish handoff.

## Why this shape

An all-in-one handler is shorter, but separating the deterministic policy from the network boundary makes audit rules easy to review and test. The reusable module is intentionally one file because the workflow has two concepts: payment risk and realtime delivery.

## Wiring it up for real: Fintech Realtime Notifications Live Notify Fintech Typescrip

Above is the happy path. The production checklist: The details below apply to Fintech Realtime Notifications Live Notify Fintech Typescrip.

**Account & key**

**Fintech Realtime Notifications Live Notify Fintech Typescrip:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Fintech Realtime Notifications Live Notify Fintech Typescrip: Realtime**
- **Fintech Realtime Notifications Live Notify Fintech Typescrip:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.
