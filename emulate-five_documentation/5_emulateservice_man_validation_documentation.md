# Emulate Validation Cookbook

Complete local validation guide for the five core emulator services in this workspace.

## Services Covered

- Google
- Apple
- Resend
- Stripe
- Twilio

## Project Architecture

| Service | Port |
| --- | --- |
| Google | 4000 |
| Apple | 4001 |
| Resend | 4002 |
| Stripe | 4003 |
| Twilio | 4004 |

## Validation Philosophy

Every emulator was validated with the same workflow:

```text
Seed Configuration
        ↓
Emulator Starts
        ↓
HTTP Endpoint Reachable
        ↓
Create Resource
        ↓
Retrieve Resource
        ↓
Update Resource
        ↓
State Transition
        ↓
Browser UI Validation
```

An emulator was considered fully working only after every stage succeeded.

---

## Google Emulator

### Browser OAuth Screen

Open directly:

`http://localhost:4000/o/oauth2/v2/auth?client_id=example-google-client.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code`

Expected:

- Google login screen
- Local developer account
- OAuth consent

### Validation 1: OpenID Configuration

```bash
curl http://localhost:4000/.well-known/openid-configuration
```

### Validation 2: OAuth Authorization

```bash
curl -i \
"http://localhost:4000/o/oauth2/v2/auth?client_id=example-google-client.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code"
```

### Validation 3: Exchange Authorization Code

```bash
curl -X POST \
http://localhost:4000/token \
-d "grant_type=authorization_code" \
-d "client_id=example-google-client.apps.googleusercontent.com"
```

### Validation 4: Retrieve User Profile

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/oauth2/v2/userinfo
```

### Validation 5: List Gmail Labels

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/gmail/v1/users/me/labels
```

### Validation 6: List Gmail Messages

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/gmail/v1/users/me/messages
```

### Validation 7: Read Message

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/gmail/v1/users/me/messages/welcome_message
```

### Validation 8: Calendar List

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/calendar/v3/users/me/calendarList
```

### Validation 9: Calendar Events

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/calendar/v3/calendars/primary/events
```

### Validation 10: Drive Files

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4000/drive/v3/files
```

---

## Apple Emulator

### Browser OAuth

```text
http://localhost:4001/auth/authorize?client_id=com.example.web&redirect_uri=http://localhost:3000/api/auth/callback/apple&response_type=code
```

Expected:

- Sign in with Apple
- Demo web app
- Local user

### Validation 1: OpenID Configuration

```bash
curl http://localhost:4001/.well-known/openid-configuration
```

### Validation 2: JWKS

```bash
curl http://localhost:4001/auth/keys
```

### Validation 3: Browser OAuth

```bash
curl -i \
"http://localhost:4001/auth/authorize?client_id=com.example.web&redirect_uri=http://localhost:3000/api/auth/callback/apple&response_type=code"
```

### Validation 4: Authorize Callback

```bash
curl -X POST \
http://localhost:4001/auth/authorize/callback \
-d "email=developer@icloud.com" \
-d "client_id=com.example.web"
```

### Validation 5: Exchange Code

```bash
curl -X POST \
http://localhost:4001/auth/token
```

### Validation 6: Refresh Token

```bash
curl -X POST \
http://localhost:4001/auth/token \
-d "grant_type=refresh_token"
```

### Validation 7: Token Revoke

```bash
curl -X POST \
http://localhost:4001/auth/revoke
```

### Validation Result

- OAuth UI works
- Client is registered
- Seeded user is visible
- Callback works
- Token endpoint works

---

## Resend Emulator

### Validation 1: Send Email

```bash
curl -X POST \
http://localhost:4002/emails \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
"from":"onboarding@example.com",
"to":["developer@example.com"],
"subject":"Hello",
"text":"Testing Resend"
}'
```

Returns:

```json
{ "id": "..." }
```

### Validation 2: Retrieve Email

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4002/emails/EMAIL_ID
```

### Validation 3: List Domains

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4002/domains
```

### Validation 4: List Contacts

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4002/contacts
```

### Validation 5: Retrieve Contact

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4002/contacts/developer@example.com
```

### Expected

- Email stored
- Delivered status
- Domain seeded
- Contact seeded

---

## Stripe Emulator

### Browser Checkout

```text
http://localhost:4003/checkout/SESSION_ID
```

### Validation 1: Create Customer

```bash
curl -X POST \
http://localhost:4003/v1/customers \
-H "Authorization: Bearer YOUR_TOKEN" \
-d "name=Prabhu Chitrakar" \
-d "email=prabhu@chitrakar.com.np"
```

### Validation 2: Retrieve Customer

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4003/v1/customers/CUSTOMER_ID
```

### Validation 3: Create Product

```bash
curl -X POST \
http://localhost:4003/v1/products \
-H "Authorization: Bearer YOUR_TOKEN" \
-d "name=Premium Emulator Plan" \
-d "description=Testing Product"
```

### Validation 4: Retrieve Product

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4003/v1/products/PRODUCT_ID
```

### Validation 5: Create Price

```bash
curl -X POST \
http://localhost:4003/v1/prices \
-H "Authorization: Bearer YOUR_TOKEN" \
-d "product=PRODUCT_ID" \
-d "currency=usd" \
-d "unit_amount=4999"
```

### Validation 6: Retrieve Price

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4003/v1/prices/PRICE_ID
```

### Validation 7: Create Payment Intent

```bash
curl -X POST \
http://localhost:4003/v1/payment_intents \
-H "Authorization: Bearer YOUR_TOKEN" \
-d "amount=5000" \
-d "currency=usd" \
-d "customer=CUSTOMER_ID"
```

### Validation 8: Confirm Payment

```bash
curl -X POST \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4003/v1/payment_intents/PI_ID/confirm
```

### Validation 9: Retrieve Payment Intent

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4003/v1/payment_intents/PI_ID
```

### Validation 10: List Charges

```bash
curl \
-H "Authorization: Bearer YOUR_TOKEN" \
http://localhost:4003/v1/charges
```

### Expected

- Customer created
- Product created
- Price created
- Payment intent succeeded
- Charge generated

---

## Twilio Emulator

### Validation 1: Account Info

```bash
curl \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/2010-04-01/Accounts.json
```

### Validation 2: List Phone Numbers

```bash
curl \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/2010-04-01/Accounts/AC00000000000000000000000000000000/IncomingPhoneNumbers.json
```

### Validation 3: Send SMS

```bash
curl -X POST \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/2010-04-01/Accounts/AC00000000000000000000000000000000/Messages.json \
-d "From=+15551234567" \
-d "To=+15550001111" \
-d "Body=Hello Emulator"
```

### Validation 4: Retrieve Message

```bash
curl \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/2010-04-01/Accounts/AC00000000000000000000000000000000/Messages/MESSAGE_SID.json
```

### Validation 5: List Messages

```bash
curl \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/2010-04-01/Accounts/AC00000000000000000000000000000000/Messages.json
```

### Validation 6: Create Verify Service

```bash
curl -X POST \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/v2/Services
```

### Validation 7: Send Verification

```bash
curl -X POST \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/v2/Services/SERVICE_SID/Verifications \
-d "To=+15550001111" \
-d "Channel=sms"
```

### Validation 8: Check Verification

```bash
curl -X POST \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/v2/Services/SERVICE_SID/VerificationCheck \
-d "To=+15550001111" \
-d "Code=123456"
```

### Validation 9: Create Conversation

```bash
curl -X POST \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/v1/Conversations
```

### Validation 10: List Conversations

```bash
curl \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
http://localhost:4004/v1/Conversations
```

## Final Validation Matrix

| Service | OAuth | CRUD | Browser UI | State Change | Status |
| --- | --- | --- | --- | --- | --- |
| Google | ✅ | ✅ | ✅ | ✅ | PASS |
| Apple | ✅ | ✅ | ✅ | ✅ | PASS |
| Resend | N/A | ✅ | N/A | ✅ | PASS |
| Stripe | N/A | ✅ | ✅ | ✅ | PASS |
| Twilio | N/A | ✅ | N/A | ✅ | PASS |

## Final Outcome

- All five emulators were successfully configured.
- All seeded configuration loaded correctly.
- Browser OAuth flows were validated.
- REST APIs were validated.
- CRUD operations were validated.
- State transitions were validated.
- Browser UIs were verified where applicable.

Result: the local development environment is fully operational and ready for integration testing, documentation, and Dockerization.
