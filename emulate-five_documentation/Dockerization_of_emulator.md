# Emulate Project - Dockerization Journey

Author: Nixhal  
Project: Emulate (Local Emulator Platform)  
Stage: Dockerization and Deployment

The final milestone of this project was to fully containerize the Emulate monorepo after successfully implementing and validating the five primary emulator services: Google, Apple, Resend, Stripe, and Twilio.

The goal was not just to run the application inside Docker. It was to package the entire workspace into a reproducible, production-style container that any developer could execute without installing Node.js, pnpm, TurboRepo, or manually configuring the environment.

## Repository Discovery

Before writing a Dockerfile, the repository layout was inspected carefully. The project is organized as a pnpm monorepo with TurboRepo managing multiple internal packages, so the first step was to verify the workspace structure and identify the files responsible for building and launching the emulator.

The main files inspected were:

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `packages/emulate/package.json`
- `packages/emulate/src/index.ts`
- `packages/emulate/tsup.config.ts`

Inspecting those files confirmed:

- Node.js engine requirements
- Required pnpm version
- Turbo build pipeline
- Workspace configuration
- CLI entry point
- Build outputs
- Generated `dist` folders
- Runtime entry point
- Bundle behavior for each emulator package

## Docker Context

The build context was prepared with a `.dockerignore` file. Build artifacts, Git history, IDE files, and other unnecessary files were excluded to keep the Docker context smaller and the build cleaner.

## Multi-Stage Docker Build

Instead of a single-stage image, a multi-stage Dockerfile was used to separate build-time concerns from runtime concerns.

The builder stage is responsible for compiling the application:

1. Copy the repository into the container
2. Install pnpm dependencies
3. Build the entire workspace
4. Generate the final `dist` folders

```text
Copy repository
        ↓
  pnpm install
        ↓
   pnpm build
        ↓
  Generate dist/
        ↓
Build completed
```

The runtime stage is based on the same `node:24-bookworm-slim` image. After reviewing how the workspace references internal emulator packages, fonts, assets, and generated bundles, the decision was made to copy the fully built application into the runtime image instead of pruning aggressively.

The runtime stage uses:

```dockerfile
COPY --from=builder /app /app
```

That guarantees every generated package, runtime dependency, compiled bundle, and required asset is present exactly as it was during the successful build.

## Runtime Configuration

The runtime environment is configured with:

- `NODE_ENV=production`
- `PORT=4000`

All emulator ports are explicitly exposed:

- `4000` for Google
- `4001` for Apple
- `4002` for Resend
- `4003` for Stripe
- `4004` for Twilio

A Docker healthcheck was also added to verify the emulator process by performing a lightweight HTTP request against the Google emulator endpoint.

## Build Behavior

During image creation, pnpm downloaded the workspace dependency graph. Multiple warnings appeared about slow tarball downloads for packages such as Next.js, Sharp, SWC, Mermaid, and other large dependencies.

Those warnings were not build failures. They were temporary retry messages and Docker completed the installation successfully.

## Image Size Investigation

After the image was built, two values required clarification:

- Content Size
- Disk Usage

Content Size refers to the compressed image layers, while Disk Usage refers to the unpacked local storage consumed after extraction.

The image history also showed several `<missing>` layers. That is normal when using Docker BuildKit, which optimizes and squashes intermediate layers during build.

One COPY instruction accounted for over one gigabyte of image content, confirming that the runtime image contains the fully built repository rather than a heavily pruned production deployment. That increases image size, but it ensures all emulator packages, assets, fonts, configuration files, and dependencies are available.

## Manual Runtime Verification

The image was then started manually with a simple `docker run` command.

The container started successfully. By mapping host port `8085` to container port `4000`, the Google emulator became accessible in the browser. That confirmed:

- The image was functional
- The Node.js runtime launched correctly
- The compiled emulator executed successfully
- Docker networking worked as expected

## Dockerfile

```dockerfile
# FIRST STAGE BUILD
FROM node:24-bookworm-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# SECOND STAGE BUILD/RUNTIME BUILD
FROM node:24-bookworm-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
EXPOSE 4001
EXPOSE 4002
EXPOSE 4003
EXPOSE 4004
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD node -e "fetch('http://127.0.0.1:4000').then(()=>process.exit(0)).catch(()=>process.exit(1))"
CMD ["node", "packages/emulate/dist/index.js", "start", "--seed", "emulate.config.yaml"]
```

## Docker Compose Limitation

This approach revealed an architectural limitation. Only the Google emulator was reachable because only a single container port had been published. Apple, Resend, Stripe, and Twilio remained inaccessible because their ports were not mapped to the host.

That could be solved with multiple `-p` flags:

- `-p 4000:4000`
- `-p 4001:4001`
- `-p 4002:4002`
- `-p 4003:4003`
- `-p 4004:4004`

That would work, but the command would become increasingly hard to maintain as more runtime configuration, healthchecks, environment variables, mounted files, and restart policies were added.

## Docker Compose

To avoid long ad hoc commands, Docker Compose became the permanent deployment entry point.

The compose file centralized:

- Image building
- Container creation
- Port mapping
- `emulate.config.yaml` mounting
- Runtime environment variables
- Restart policy
- Healthcheck registration
- Emulator startup command

## `docker-compose.yml`

```yaml
version: "3.9"

services:
  emulate:
    container_name: emulator-five
    build:
      context: .
      dockerfile: Dockerfile
    image: emulate:latest
    restart: unless-stopped
    ports:
      - "4000:4000" # Google
      - "4001:4001" # Apple
      - "4002:4002" # Resend
      - "4003:4003" # Stripe
      - "4004:4004" # Twilio
    environment:
      NODE_ENV: production
      PORT: 4000
    volumes:
      - ./emulate.config.yaml:/app/emulate.config.yaml:ro
    command:
      ["node", "packages/emulate/dist/index.js", "start", "--seed", "emulate.config.yaml"]
    healthcheck:
      test:
        ["CMD", "node", "-e", "fetch('http://127.0.0.1:4000').then(()=>process.exit(0)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

## Final Deployment Result

After rebuilding from scratch, Docker Compose launched the container without manual runtime setup.

Every emulator started as expected:

- Google on port `4000`
- Apple on port `4001`
- Resend on port `4002`
- Stripe on port `4003`
- Twilio on port `4004`

The deployment workflow was reduced to:

```bash
docker compose build
docker compose up -d
```

## Outcome

The Emulate project is now fully containerized. The validated emulator services that previously ran manually inside the local Node.js environment now run inside a reproducible Docker environment using a multi-stage build and Docker Compose orchestration.

The project no longer depends on the host development environment and can be executed consistently across different machines while preserving the runtime behavior validated earlier.

This establishes a portable, reproducible deployment suitable for local development, demonstrations, continuous integration environments, and future production-style deployments.
