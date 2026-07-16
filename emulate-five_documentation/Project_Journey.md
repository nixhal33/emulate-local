# Project Journey

Building and validating a complete local API emulator environment.

Author: Nixhal

## Overview

This document captures the engineering journey behind the Emulate project.

Instead of treating the project like a black box, the repository was explored service by service, each emulator was understood internally, every exposed API was validated, and the configuration was reduced into a cleaner production-ready setup.

The objective was not just to run the project. The objective was to understand how every emulator works internally so future development, maintenance, and Dockerization become straightforward.

The services explored were:

- Google
- Twilio
- Resend
- Apple
- Stripe

Every one of these services now runs locally and has been verified through real API requests.

## Phase 1: Understanding the Project Structure

Before changing anything, the repository structure was explored.

Instead of immediately editing configuration files, the implementation of every emulator was reviewed.

For every service, the following directories were inspected:

```text
packages/@emulators/<service>/src/
```

Inside each service, these files and folders were reviewed:

- `helpers.ts`
- `entities.ts`
- `index.ts`
- `store.ts`
- `routes/`
- `__tests__/`

That revealed a consistent architecture across all emulators:

- Data entities
- Internal storage
- Helper utilities
- Route definitions
- Seed configuration
- Automated tests

Understanding this structure first made later debugging much easier.

## Phase 2: Understanding Registration

The next goal was to understand how each emulator becomes active.

Inside each `index.ts`, the flow was:

1. `seedDefaults()`
2. `seedFromConfig()`
3. `register()`

That answered several important questions:

- Where default data comes from
- How `emulate.config.yaml` is loaded
- How users are inserted
- How OAuth applications are registered
- How routes become active
- How Hono mounts endpoints

Understanding those functions removed most of the guesswork.

## Phase 3: Understanding Routes

For each emulator, all registered endpoints were searched directly.

Instead of relying on documentation, the route definitions were inspected.

This exposed:

- Google OAuth endpoints
- Apple OAuth endpoints
- Stripe payment endpoints
- Twilio messaging endpoints
- Resend email endpoints

At that point the URL surface for every emulator was known precisely.

## Phase 4: Building a Better Configuration

The default configuration file contained many unrelated services.

Rather than keeping everything enabled, the configuration was redesigned around only the services that were needed.

The final configuration contains:

- Google
- Twilio
- Resend
- Apple
- Stripe

Each section was simplified while still demonstrating realistic production-like configuration.

Each emulator now has:

- Sample users
- OAuth clients
- Seeded resources
- Realistic metadata
- Clean comments
- Logical ordering

The resulting YAML is easier to understand for both developers and reviewers.

## Phase 5: Google Emulator

Google required the deepest exploration.

Unlike the others, Google contains multiple independent systems:

- OAuth
- Gmail
- Calendar
- Drive
- Labels
- Messages
- Calendars
- Events
- Drive hierarchy

The goal was not just OAuth. Every available subsystem was configured.

After users and OAuth clients were configured, the following data was seeded:

- Mail labels
- Emails
- Calendar
- Calendar events
- Drive folders

That made the emulator much closer to a real Google account.

Eventually OAuth authentication displayed the Google sign-in UI successfully.

After authentication, the configured data became available through the corresponding APIs.

## Phase 6: Twilio Emulator

Twilio was explored next.

Rather than only verifying authentication, nearly every available subsystem was configured:

- Account
- API keys
- Phone numbers
- Messaging service
- Verify service
- Conversation service

Validation included:

- SMS sending
- Verify codes
- Message retrieval
- Phone numbers
- Account information
- Messaging service
- Conversation service

The responses behaved consistently with the expected API.

Twilio became one of the easiest emulators to validate.

## Phase 7: Resend Emulator

Resend required much less configuration.

Only two sections were needed:

- Domains
- Contacts

Once configured, validation covered:

- Listing domains
- Creating emails
- Retrieving emails
- Listing contacts
- Domain verification

The emulator consistently returned successful responses.

One validation could not be repeated later because the original email was lost, but all remaining validations confirmed correct behavior.

## Phase 8: Apple Emulator

Apple introduced a different workflow.

Instead of immediately exposing REST endpoints, the emulator primarily implements Sign in with Apple.

Initially the authorization page reported:

`Application not found`

That showed no OAuth client had been configured.

After adding:

- `client_id`
- `team_id`
- `key_id`
- redirect URI

the authorization UI changed immediately.

The application name appeared.

Configured users appeared.

The sign-in page behaved correctly.

That confirmed the OAuth configuration was functioning as expected.

Unlike Twilio or Stripe, Apple is primarily UI-driven because OAuth starts inside a browser.

## Phase 9: Stripe Emulator

Stripe became the most feature-rich validation.

The exploration included:

- Customers
- Products
- Prices
- Payment intents
- Charges
- Checkout

Rather than stopping after customer creation, a complete payment flow was simulated:

1. Create customer
2. Retrieve customer
3. Create payment intent
4. Confirm payment
5. Retrieve payment intent
6. List charges
7. Create products
8. Create prices
9. Retrieve products
10. Retrieve prices

The final payment completed successfully.

Charges appeared automatically.

Products and prices became retrievable through the API.

The emulator behaved similarly to the real Stripe developer environment.

## Phase 10: UI Validation

An important discovery was that not every emulator exposes the same style of interface.

- Google provides OAuth browser screens
- Apple provides Sign in with Apple pages
- Stripe provides a Checkout simulation UI
- Twilio is primarily API-driven
- Resend is primarily API-driven

Understanding that distinction prevented unnecessary debugging when certain services intentionally did not expose dashboard interfaces.

## Phase 11: Creating a Minimal Configuration

Once every emulator had been validated independently, the configuration was simplified.

Instead of keeping dozens of services enabled, only the required five remain.

That improved:

- Readability
- Startup speed
- Maintainability
- Future Dockerization

The final configuration is much easier for new developers to understand.

## Phase 12: Documentation

Throughout the project, structured documentation was created to capture each major step.

This includes:

- Validation Cookbook
- Validation Checklist
- README
- Troubleshooting Log
- Project Journey

Each document serves a different purpose:

- Validation Cookbook contains executable API validation commands
- Troubleshooting Log documents problems encountered and their resolutions
- README explains project usage
- Project Journey captures the engineering process behind the work

## Final Result

At the conclusion of the project:

- Google emulator fully configured
- Twilio emulator fully configured
- Resend emulator fully configured
- Apple emulator fully configured
- Stripe emulator fully configured
- OAuth flows operational
- Browser UIs verified
- REST APIs validated
- Configuration simplified
- Documentation completed

The project evolved from an unfamiliar codebase into a fully understood local development platform.

Rather than relying on assumptions or documentation alone, every emulator was studied directly from its implementation, configured manually, validated using real requests, and documented thoroughly.

That created a reliable local environment suitable for future feature development, testing, demonstrations, onboarding, and eventual containerization through Docker.

## Next Step

The next phase of the project is to package this environment into a Docker image.

The minimal configuration, validation cookbook, documentation, and verified emulator setup provide a strong foundation for creating a reproducible local deployment.

