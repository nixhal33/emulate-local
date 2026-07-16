# Emulate Local Development Log

Author: Nixhal  
Project: Emulate  
Repository: `github.com/vercel-labs/emulate`  
Purpose: Personal Engineering Log  
Date: 2026

## Objective

The goal was to build Emulate from source, understand every emulator internally, configure multiple services, debug startup failures, validate every API manually, and produce a lightweight configuration that can run locally.

Rather than treating Emulate as a black box, every service was inspected, understood, and verified individually.

The validation order used was:

1. Twilio
2. Google
3. Resend
4. Apple
5. Stripe

## Initial Setup

Repository cloned.

Environment:

- Ubuntu Linux
- Node.js
- npm
- pnpm
- Git
- Docker installed, but not required during API validation

## First Problem: Application Would Not Start

### Symptoms

- npm install failures
- dependency resolution issues
- build failures
- emulator not starting

### Investigation

Verified:

- Node version
- npm version
- pnpm version
- package manager compatibility
- workspace packages

Repeated rebuilds were performed until every workspace package compiled correctly.

Commands repeatedly used:

- `pnpm install`
- `pnpm build`
- `pnpm rebuild`
- `pnpm dev`
- `npm install`
- `npm rebuild`

Eventually the workspace compiled successfully.

## Second Problem: Understanding Project Structure

Before changing configuration, the internal source code of every emulator was inspected.

Instead of blindly editing `emulate.config.yaml`, the actual implementation was explored.

For every service, the following commands were used:

```text
services ie: apple, twilio, resend, stripe & google
```

### Find every source file

```bash
find packages/@emulators/<service>/src -type f
```

### Locate every HTTP endpoint

```bash
grep -R "app\." packages/@emulators/<service>/src
```

### Locate configuration seeding

```bash
grep -n "seed" packages/@emulators/<service>/src/index.ts
```

### Inspect `index.ts`

```bash
sed -n '1,240p' packages/@emulators/<service>/src/index.ts
```

### Services inspected

- Google
- Twilio
- Resend
- Apple
- Stripe

This helped determine:

- Supported APIs
- Registered routes
- Seed configuration
- Expected configuration fields
- Internal storage
- Missing features

## Third Problem: Configuration Too Large

The default configuration contained many services.

### Goal

Reduce the configuration to only the services needed.

### Original

15+ services

### Final

- Google
- Twilio
- Resend
- Apple
- Stripe

### Benefits

- Much easier to understand
- Much faster startup
- Less configuration noise
- Easy for a supervisor to review

## Twilio

### Status

First fully validated service.

### Approach

Started with the smallest API and validated one endpoint at a time.

### Verified

- Account
- Phone numbers
- SMS
- Messaging
- Verify
- Conversations

Validation was performed through `curl`.

Every endpoint returned expected JSON.

No emulator modifications were required.

### Conclusion

Twilio emulator worked correctly.

## Google

### Most Difficult Emulator

Google required the largest amount of investigation.

### Problems Encountered

- OAuth failures
- Client registration confusion
- Redirect URI mismatch
- Configuration mismatch
- Seeded data confusion
- Routes requiring proper OAuth client

### Investigation

- Read source code
- Read routing implementation
- Inspected OAuth registration
- Compared configuration with implementation
- Restarted the emulator after every configuration change

### Configuration Edited

- Users
- OAuth clients
- Labels
- Messages
- Calendar
- Calendar events
- Drive items

Every section was verified individually.

OAuth finally worked.

Gmail worked.

Calendar worked.

Drive worked.

Google became fully operational.

### Conclusion

Google required the deepest understanding of the project.

## Resend

### Very Straightforward

Configured:

- Domains
- Contacts

### Validation

- Create email
- Retrieve email
- List emails
- List domains
- List contacts

Most endpoints immediately worked.

One historical email lookup failed only because the email no longer existed.

The emulator itself behaved correctly.

### Conclusion

Resend required almost no debugging.

## Apple

### Initial Issue

`Application not found`

### Reason

The OAuth client had not been configured.

### Error

`The client_id 'com.example.web' is not registered.`

### Resolution

Added:

- `oauth_clients`
- `client_id`
- `team_id`
- `key_id`
- `redirect_uri`

The emulator was restarted.

### Validation

- OAuth page opened successfully
- Sign in page rendered
- Seeded user appeared
- Authorization code was generated
- Redirect succeeded

### Observation

Unlike Twilio or Resend, Apple primarily validates through its OAuth UI.

There is no large dashboard showing seeded data.

That behavior matches the emulator implementation.

## Stripe

### Final Service Validated

Performed a complete payment flow:

- Created customer
- Created payment intent
- Confirmed payment
- Generated charge
- Retrieved charge
- Created product
- Created price
- Retrieved product
- Retrieved price

Everything returned expected Stripe JSON.

### Extra Validation

- Created an additional product
- Assigned a price
- Retrieved it through the API
- Confirmed the object appeared inside the emulator

Stripe validation completed successfully.

## Other Problems Encountered

### Port Already In Use

Error:

`EADDRINUSE`

Reason:

Previous emulator instance was still running.

Diagnosis:

```bash
ss -tulnp | grep <port>
```

The existing process was killed and the emulator was restarted.

Problem solved.

### Docker

Docker was initially suspected, but it was confirmed to be unrelated.

The entire validation was completed without Docker.

### Authentication

Most services required:

`Authorization: Bearer test_token_admin`

Missing tokens produced authentication failures.

### Configuration Changes Not Visible

Reason:

The server had not restarted.

The emulator was always restarted after configuration changes.

## Final Configuration

The project was reduced to:

- Google
- Twilio
- Resend
- Apple
- Stripe

Only essential seeded resources were kept.

The configuration became:

- Clean
- Small
- Easy to explain
- Ideal for demonstrations

## Final Validation

Every service was validated manually.

No automated testing was relied upon.

Verification was performed through:

- `curl`
- Browser
- OAuth redirects
- Resource retrieval
- Resource creation
- Payment flow
- Message sending
- Verification endpoints
- OAuth login
- Charge creation
- Customer creation
- Product creation
- Price creation

All expected responses returned successfully.

## Lessons Learned

- Never modify configuration before understanding source code.
- Always inspect routes before testing APIs.
- Always inspect seed functions before writing configuration.
- Validate incrementally.
- Test one endpoint at a time.
- Restart the emulator after configuration edits.
- Prefer minimal configuration.
- Understand implementation before debugging.

## Final Result

Successfully built Emulate locally.

Successfully configured five production-grade emulators:

- Google
- Twilio
- Resend
- Apple
- Stripe

Every service was manually validated.

Produced:

- Validation Cookbook
- Troubleshooting Log
- Minimal Configuration
- Engineering Notes

The repository is ready for documentation and Dockerization.

## End of Log

