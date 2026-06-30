# Emulate Validation Guide

> Comprehensive validation reference for the emulator services tested.

## Environment

-   Base tokens: `Authorization: Bearer YOUR_TOKEN`

## Google

``` bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4002/gmail/v1/users/me/profile
```

Purpose: Validate Gmail profile.

``` bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4002/gmail/v1/users/me/messages
```

Purpose: List messages.

``` bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4002/calendar/v3/calendars/primary/events
```

Purpose: List calendar events.

``` bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4002/drive/v3/files
```

Purpose: List Drive files.

## Twilio

``` bash
curl -X POST http://localhost:4003/2010-04-01/Accounts/ACCOUNT_SID/Messages.json -d "To=+15550001111" -d "From=+15551234567" -d "Body=Hello"
```

Purpose: Send SMS.

``` bash
curl http://localhost:4003/2010-04-01/Accounts/ACCOUNT_SID/Messages.json
```

Purpose: List SMS.

``` bash
curl http://localhost:4003/2010-04-01/Accounts/ACCOUNT_SID/Calls.json
```

Purpose: List calls.

## Resend

``` bash
curl -X POST http://localhost:4008/emails -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"from":"onboarding@example.com","to":["test@example.com"],"subject":"Hello","text":"Testing"}'
```

Purpose: Send email.

``` bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4008/emails
```

Purpose: List emails.

``` bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4008/emails/EMAIL_ID
```

Purpose: Fetch email.

``` bash
curl -X POST http://localhost:4008/emails/batch ...
```

Purpose: Batch email.

``` bash
curl -X POST http://localhost:4008/emails/EMAIL_ID/cancel
```

Purpose: Cancel scheduled email.

## Apple

``` bash
curl http://localhost:4004/.well-known/openid-configuration
```

Purpose: OIDC discovery.

``` bash
curl http://localhost:4004/auth/keys
```

Purpose: JWKS.

``` bash
curl "http://localhost:4004/auth/authorize?client_id=com.example.web&redirect_uri=http://localhost:3000/api/auth/callback/apple&response_type=code"
```

Purpose: OAuth UI.

``` bash
curl -X POST http://localhost:4004/auth/token
```

Purpose: Exchange code.

``` bash
curl -X POST http://localhost:4004/auth/revoke
```

Purpose: Revoke token.

## Stripe

``` bash
curl -X POST http://localhost:4009/v1/customers -H "Authorization: Bearer YOUR_TOKEN" -d "name=John Doe" -d "email=john@example.com"
```

Purpose: Create customer.

``` bash
curl http://localhost:4009/v1/customers/CUSTOMER_ID
```

Purpose: Get customer.

``` bash
curl -X POST http://localhost:4009/v1/payment_intents -d "amount=5000" -d "currency=usd" -d "customer=CUSTOMER_ID"
```

Purpose: Create payment intent.

``` bash
curl -X POST http://localhost:4009/v1/payment_intents/PI_ID/confirm
```

Purpose: Confirm payment.

``` bash
curl http://localhost:4009/v1/payment_intents/PI_ID
```

Purpose: Retrieve payment intent.

``` bash
curl http://localhost:4009/v1/charges
```

Purpose: List charges.

## Validation Checklist

-   Google ✔
-   Twilio ✔
-   Resend ✔
-   Apple ✔
-   Stripe ✔
