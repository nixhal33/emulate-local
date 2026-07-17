interface Service {
  id: string;
  name: string;
  port: number;
  color: string;
  description: string;
  features: string[];
  version: string;
  status: "Healthy" | "Offline";
  docs: string;
  dashboard: string;
  apiExplorer: string;
}

interface ServiceHealth extends Service {
  url: string;
  healthy: boolean;
}

const PLATFORM_VERSION = "v0.8.0";
const PLATFORM_RUNTIME = "Node.js";
const HEALTH_CHECK_INTERVAL_MS = 5000;

const SERVICES: ServiceHealth[] = [
  {
    id: "google",
    name: "Google",
    port: 4000,
    color: "#4285F4",
    description: "Google OAuth2, Gmail, Calendar and Drive emulator",
    features: ["OAuth2", "Gmail", "Calendar", "Drive"],
    version: PLATFORM_VERSION,
    status: "Healthy",
    docs: "https://developers.google.com/",
    dashboard:
      "/o/oauth2/v2/auth?client_id=example-google-client.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code",
    apiExplorer: "/oauth2/v2/userinfo",
    url: "http://localhost:4000",
    healthy: true,
  },
  {
    id: "apple",
    name: "Apple",
    port: 4001,
    color: "#111111",
    description: "Sign in with Apple emulator",
    features: ["OAuth", "OpenID", "JWKS"],
    version: PLATFORM_VERSION,
    status: "Healthy",
    docs: "https://developer.apple.com/documentation/signinwithapple",
    dashboard:
      "/auth/authorize?client_id=com.example.web&redirect_uri=http://localhost:3000/api/auth/callback/apple&response_type=code",
    apiExplorer: "/.well-known/openid-configuration",
    url: "http://localhost:4001",
    healthy: true,
  },
  {
    id: "resend",
    name: "Resend",
    port: 4002,
    color: "#000000",
    description: "Transactional email emulator",
    features: ["Emails", "Inbox", "Domains", "Contacts"],
    version: PLATFORM_VERSION,
    status: "Healthy",
    docs: "https://resend.com/docs",
    dashboard: "/inbox",
    apiExplorer: "/emails",
    url: "http://localhost:4002",
    healthy: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    port: 4003,
    color: "#635BFF",
    description: "Payments and checkout emulator",
    features: ["Customers", "Products", "Payments", "Checkout"],
    version: PLATFORM_VERSION,
    status: "Healthy",
    docs: "https://docs.stripe.com/api",
    dashboard: "/v1/products",
    apiExplorer: "/v1/products",
    url: "http://localhost:4003",
    healthy: true,
  },
  {
    id: "twilio",
    name: "Twilio",
    port: 4004,
    color: "#F22F46",
    description: "Messaging, Verify and Calls emulator",
    features: ["SMS", "Verify", "Calls", "Inspector"],
    version: PLATFORM_VERSION,
    status: "Healthy",
    docs: "https://www.twilio.com/docs",
    dashboard: "/",
    apiExplorer: "/2010-04-01/Accounts.json",
    url: "http://localhost:4004",
    healthy: true,
  },
];

function renderHead(): string {
  return `
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Emulate Control Center</title>
  <style>
    :root {
      --bg: #070b14;
      --bg-2: #0c1324;
      --surface: rgba(15, 23, 42, 0.78);
      --surface-strong: rgba(17, 24, 39, 0.92);
      --surface-hover: rgba(30, 41, 59, 0.95);
      --border: rgba(148, 163, 184, 0.16);
      --border-strong: rgba(148, 163, 184, 0.24);
      --text: #e5eefb;
      --muted: #91a4bf;
      --primary: #4f8cff;
      --primary-strong: #2563eb;
      --success: #22c55e;
      --warning: #f59e0b;
      --danger: #ef4444;
      --shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      min-height: 100%;
    }

    body {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(79, 140, 255, 0.18), transparent 32%),
        radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 28%),
        linear-gradient(135deg, var(--bg), var(--bg-2) 52%, #050816);
      min-height: 100vh;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    .page-shell {
      position: relative;
      overflow: hidden;
    }

    .page-shell::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 78%);
      pointer-events: none;
      opacity: 0.5;
    }

    .page {
      position: relative;
      z-index: 1;
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px 24px 48px;
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 20px;
      margin-bottom: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 22px;
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
      position: sticky;
      top: 16px;
      z-index: 20;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .brand-mark {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, rgba(79, 140, 255, 0.2), rgba(34, 197, 94, 0.18));
      border: 1px solid var(--border-strong);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
      font-weight: 800;
    }

    .brand-copy {
      min-width: 0;
    }

    .brand-copy h1 {
      margin: 0;
      font-size: 1.05rem;
      letter-spacing: 0.02em;
    }

    .brand-copy p {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .nav-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.42);
      color: var(--text);
      font-size: 0.84rem;
      white-space: nowrap;
    }

    .pill-muted {
      color: var(--muted);
    }

    .pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--success);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.95fr);
      gap: 20px;
      margin-bottom: 20px;
    }

    .hero-panel, .glass-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
    }

    .hero-main {
      padding: 32px;
      position: relative;
      overflow: hidden;
    }

    .hero-main::after {
      content: "";
      position: absolute;
      inset: auto -20px -40px auto;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(79, 140, 255, 0.2), transparent 68%);
      pointer-events: none;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(79, 140, 255, 0.25);
      background: rgba(37, 99, 235, 0.12);
      color: #c8d8ff;
      font-size: 0.84rem;
      margin-bottom: 18px;
    }

    .hero-main h2 {
      margin: 0;
      font-size: clamp(2.4rem, 4vw, 4.8rem);
      line-height: 0.98;
      letter-spacing: -0.04em;
      max-width: 11ch;
    }

    .hero-main p {
      margin: 18px 0 0;
      max-width: 760px;
      color: var(--muted);
      line-height: 1.75;
      font-size: 1.02rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 46px;
      padding: 0 18px;
      border-radius: 14px;
      border: 1px solid var(--border);
      transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, opacity 180ms ease;
    }

    .action-button:hover {
      transform: translateY(-1px);
      border-color: var(--border-strong);
    }

    .action-button.primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-strong));
      color: white;
      border-color: transparent;
    }

    .action-button.secondary {
      background: rgba(15, 23, 42, 0.42);
      color: var(--text);
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .stat-card {
      padding: 20px;
      min-height: 132px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: var(--surface-strong);
      border: 1px solid var(--border);
      border-radius: 24px;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-strong);
      background: var(--surface-hover);
    }

    .stat-label {
      color: var(--muted);
      font-size: 0.88rem;
    }

    .stat-value {
      font-size: 2rem;
      line-height: 1;
      font-weight: 750;
      letter-spacing: -0.03em;
    }

    .stat-subtext {
      color: var(--muted);
      font-size: 0.88rem;
    }

    .section-title {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 16px;
      margin: 26px 4px 14px;
    }

    .section-title h3 {
      margin: 0;
      font-size: 1.05rem;
      letter-spacing: 0.01em;
    }

    .section-title p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .services {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 16px;
    }

    .service-card {
      grid-column: span 6;
      padding: 22px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
    }

    .service-card:hover {
      transform: translateY(-3px);
      border-color: var(--border-strong);
      background: var(--surface-hover);
    }

    .service-top {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
    }

    .service-ident {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .service-icon {
      width: 18px;
      height: 18px;
      border-radius: 6px;
      box-shadow: 0 0 0 6px rgba(255,255,255,0.03);
      flex: 0 0 auto;
      opacity: 1;
      transition: opacity 180ms ease;
    }

    .service-name {
      margin: 0;
      font-size: 1.08rem;
    }

    .service-endpoint {
      margin: 6px 0 0;
      color: #87b4ff;
      font-size: 0.88rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      word-break: break-all;
    }

    .version-badge, .status-badge, .mini-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 11px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.45);
      color: var(--text);
      font-size: 0.78rem;
      white-space: nowrap;
    }

    .status-badge[data-state="Healthy"] {
      color: #8df7af;
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(34, 197, 94, 0.12);
    }

    .status-badge[data-state="Offline"] {
      color: #ff9b9b;
      border-color: rgba(239, 68, 68, 0.3);
      background: rgba(239, 68, 68, 0.12);
    }

    .description {
      margin: 12px 0 16px;
      color: var(--muted);
      line-height: 1.65;
    }

    .feature-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 18px;
    }

    .feature {
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.76rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.03);
    }

    .service-meta {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin: 16px 0 18px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-label {
      color: var(--muted);
      font-size: 0.78rem;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .meta-value {
      font-size: 0.95rem;
      word-break: break-all;
    }

    .service-buttons {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .service-button {
      min-height: 42px;
      padding: 0 14px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.5);
      color: var(--text);
      transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, opacity 180ms ease;
    }

    .service-button:hover {
      transform: translateY(-1px);
      border-color: var(--border-strong);
      background: rgba(30, 41, 59, 0.95);
    }

    .service-button.primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-strong));
      border-color: transparent;
    }

    .service-button.primary:hover {
      opacity: 0.96;
    }

    .service-button.secondary {
      background: rgba(15, 23, 42, 0.45);
    }

    .system {
      margin-top: 22px;
      padding: 24px;
    }

    .system-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-top: 18px;
    }

    .system-item {
      padding: 18px;
      background: rgba(15, 23, 42, 0.42);
      border: 1px solid var(--border);
      border-radius: 18px;
    }

    .system-item .meta-label {
      margin-bottom: 8px;
      display: block;
    }

    .system-item strong {
      font-size: 1rem;
      font-weight: 700;
    }

    .footer {
      margin: 22px 0 0;
      padding: 20px 6px 0;
      color: var(--muted);
      text-align: center;
      font-size: 0.92rem;
    }

    .service-card.is-offline .service-icon {
      opacity: 0.35;
    }

    .service-card.is-offline {
      border-color: rgba(239, 68, 68, 0.25);
    }

    .service-card.is-healthy {
      border-color: rgba(34, 197, 94, 0.16);
    }

    @media (max-width: 1100px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .services {
        grid-template-columns: 1fr;
      }

      .service-card {
        grid-column: auto;
      }

      .system-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 720px) {
      .page {
        padding: 14px 14px 32px;
      }

      .navbar {
        padding: 14px;
        top: 10px;
        border-radius: 18px;
      }

      .brand-copy p {
        display: none;
      }

      .hero-main,
      .system,
      .service-card {
        border-radius: 22px;
      }

      .hero-main {
        padding: 24px;
      }

      .hero-stats,
      .service-meta,
      .service-buttons,
      .system-grid {
        grid-template-columns: 1fr;
      }

      .service-top {
        flex-direction: column;
      }
    }
  </style>
</head>
`;
}

function renderNavbar(): string {
  return `
<nav class="navbar">
  <div class="brand">
    <div class="brand-mark">E</div>
    <div class="brand-copy">
      <h1>Emulate Control Center</h1>
      <p>Local API emulator dashboard for developers</p>
    </div>
  </div>

  <div class="nav-meta">
    <span class="pill"><span class="pill-dot" id="nav-health-dot"></span><span id="nav-health-text">All Services Healthy</span></span>
    <span class="pill pill-muted" id="nav-version-pill">${PLATFORM_VERSION}</span>
  </div>
</nav>
`;
}

function renderHero(): string {
  return `
<section class="hero">
  <div class="hero-panel hero-main">
    <div class="eyebrow">Developer Home</div>
    <h2>One control panel for every local emulator.</h2>
    <p>
      Start, inspect, and navigate Google, Apple, Resend, Stripe, and Twilio from one local dashboard.
      Health, endpoints, documentation, and quick actions stay visible without memorizing ports.
    </p>
    <div class="hero-actions">
      <button class="action-button primary" data-hero-action="google">Open Google</button>
      <button class="action-button secondary" data-hero-action="stripe">Open Stripe</button>
    </div>
  </div>

  <div class="hero-stats">
    <div class="stat-card">
      <span class="stat-label">Running Services</span>
      <div class="stat-value" id="stat-running">5/5</div>
      <span class="stat-subtext">All configured emulators</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Offline Services</span>
      <div class="stat-value" id="stat-offline">0</div>
      <span class="stat-subtext">Live health monitored</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Known Endpoints</span>
      <div class="stat-value" id="stat-endpoints">5</div>
      <span class="stat-subtext">Local service entry points</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Average Response Time</span>
      <div class="stat-value" id="stat-response">0ms</div>
      <span class="stat-subtext">Health endpoint latency</span>
    </div>
  </div>
</section>
`;
}

function renderServices(): string {
  return `
<section>
  <div class="section-title">
    <div>
      <h3>Services</h3>
      <p>Each card maps directly from the service registry.</p>
    </div>
    <p id="service-summary">5 services online</p>
  </div>
  <div class="services">
    ${SERVICES.map(renderServiceCard).join("")}
  </div>
</section>
`;
}

function renderServiceCard(service: Service): string {
  return `
<article class="service-card is-healthy" data-service-id="${service.id}" data-port="${service.port}">
  <div class="service-top">
    <div class="service-ident">
      <div class="service-icon" style="background:${service.color};"></div>
      <div>
        <h4 class="service-name">${service.name}</h4>
        <p class="service-endpoint">http://localhost:${service.port}</p>
      </div>
    </div>
    <span class="version-badge">${service.version}</span>
  </div>

  <p class="description">${service.description}</p>

  <div class="feature-list">
    ${service.features
      .map(
        (feature) => `
          <span class="feature" style="border:1px solid ${service.color}; color:${service.color};">
            ${feature}
          </span>
        `,
      )
      .join("")}
  </div>

  <div class="service-meta">
    <div class="meta-item">
      <span class="meta-label">Port</span>
      <span class="meta-value">localhost:${service.port}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Status</span>
      <span class="status-badge" data-state="${service.status}">${service.status}</span>
    </div>
  </div>

  <div class="service-buttons">
    <button class="service-button primary" data-action="dashboard" data-port="${service.port}" data-path="${service.dashboard}">Dashboard</button>
    <button class="service-button secondary" data-action="api" data-port="${service.port}" data-path="${service.apiExplorer}">API Explorer</button>
    <button class="service-button secondary" data-action="copy" data-port="${service.port}">Copy URL</button>
    <button class="service-button secondary" data-action="docs" data-docs="${service.docs}">Documentation</button>
  </div>
</article>
`;
}

function renderSystemInfo(): string {
  return `
<section class="glass-panel system">
  <div class="section-title" style="margin:0;">
    <div>
      <h3>System Information</h3>
      <p>Live platform summary for the local emulator stack.</p>
    </div>
  </div>

  <div class="system-grid">
    <div class="system-item">
      <span class="meta-label">Running Services</span>
      <strong id="sys-running">5/5</strong>
    </div>
    <div class="system-item">
      <span class="meta-label">Runtime</span>
      <strong id="sys-runtime">${PLATFORM_RUNTIME}</strong>
    </div>
    <div class="system-item">
      <span class="meta-label">Platform Version</span>
      <strong id="sys-version">${PLATFORM_VERSION}</strong>
    </div>
    <div class="system-item">
      <span class="meta-label">Service Ports</span>
      <strong id="sys-container">4000-4004</strong>
    </div>
  </div>
</section>
`;
}

function renderFooter(): string {
  return `
<footer class="footer">
  Emulate Control Center for local API development
</footer>
`;
}

function renderScripts(): string {
  return `
<script>
(function () {
  const platformVersion = ${JSON.stringify(PLATFORM_VERSION)};
  const services = ${JSON.stringify(SERVICES)};
  const healthIntervalMs = ${HEALTH_CHECK_INTERVAL_MS};

  const state = {
    running: services.length,
    offline: 0,
    averageResponseTimeMs: 0,
  };

  function buildUrl(port, path = "") {
    return window.location.protocol + "//" + window.location.hostname + ":" + port + path;
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function updateGlobalStats() {
    const runningLabel = state.running + "/" + services.length;
    setText("stat-running", runningLabel);
    setText("stat-offline", String(state.offline));
    setText("stat-endpoints", String(services.length));
    setText("stat-response", Math.round(state.averageResponseTimeMs) + "ms");
    setText("sys-running", runningLabel);
    setText("sys-version", platformVersion);
    setText("service-summary", state.running + " services online");

    const navHealthText = document.getElementById("nav-health-text");
    const navHealthDot = document.getElementById("nav-health-dot");
    if (navHealthText && navHealthDot) {
      navHealthText.textContent = state.offline === 0 ? "All Services Healthy" : state.offline + " Offline";
      navHealthDot.style.background = state.offline === 0 ? "#22c55e" : "#ef4444";
      navHealthDot.style.boxShadow = state.offline === 0 ? "0 0 0 4px rgba(34,197,94,0.12)" : "0 0 0 4px rgba(239,68,68,0.12)";
    }
  }

  function setCardStatus(card, healthy, responseTimeMs) {
    const statusBadge = card.querySelector(".status-badge");
    const icon = card.querySelector(".service-icon");
    if (statusBadge) {
      statusBadge.textContent = healthy ? "Healthy" : "Offline";
      statusBadge.dataset.state = healthy ? "Healthy" : "Offline";
    }
    if (icon) {
      icon.style.opacity = healthy ? "1" : "0.35";
    }
    card.classList.toggle("is-healthy", healthy);
    card.classList.toggle("is-offline", !healthy);
    card.dataset.responseTime = String(responseTimeMs || 0);
  }

  async function probeService(card) {
    const port = card.dataset.port;
    if (!port) {
      return { healthy: false, responseTimeMs: 0 };
    }

    const start = performance.now();
    const healthUrl = buildUrl(port, "/health");
    const rootUrl = buildUrl(port);

    try {
      const response = await fetch(healthUrl, { cache: "no-store" });
      if (response.ok) {
        const elapsed = performance.now() - start;
        return { healthy: true, responseTimeMs: elapsed };
      }
    } catch (error) {
      void error;
    }

    try {
      const response = await fetch(rootUrl, { cache: "no-store" });
      const elapsed = performance.now() - start;
      return { healthy: response.ok, responseTimeMs: elapsed };
    } catch (error) {
      void error;
      return { healthy: false, responseTimeMs: 0 };
    }
  }

  async function refreshHealth() {
    const cards = Array.from(document.querySelectorAll(".service-card"));
    const results = await Promise.all(
      cards.map(async (card) => {
        const result = await probeService(card);
        setCardStatus(card, result.healthy, result.responseTimeMs);
        return result;
      }),
    );

    let runningCount = 0;
    let offlineCount = 0;
    let totalResponseTime = 0;
    let responseSamples = 0;

    for (const result of results) {
      if (result.healthy) {
        runningCount += 1;
        if (result.responseTimeMs > 0) {
          totalResponseTime += result.responseTimeMs;
          responseSamples += 1;
        }
      } else {
        offlineCount += 1;
      }
    }

    state.running = runningCount;
    state.offline = offlineCount;
    state.averageResponseTimeMs = responseSamples > 0 ? totalResponseTime / responseSamples : 0;
    updateGlobalStats();
  }

  function openServicePath(port, path) {
    window.open(buildUrl(port, path), "_blank", "noopener,noreferrer");
  }

  function copyServiceUrl(port) {
    return navigator.clipboard.writeText(buildUrl(port));
  }

  function bindServiceButtons() {
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        const action = button.dataset.action;
        const port = button.dataset.port;
        const path = button.dataset.path || "";
        const docs = button.dataset.docs;

        if (action === "dashboard" && port) {
          openServicePath(port, path);
          return;
        }

        if (action === "api" && port) {
          openServicePath(port, path);
          return;
        }

        if (action === "docs" && docs) {
          window.open(docs, "_blank", "noopener,noreferrer");
          return;
        }

        if (action === "copy" && port) {
          try {
            const originalText = button.textContent || "Copy URL";
            await copyServiceUrl(port);
            button.textContent = "Copied";
            window.setTimeout(() => {
              button.textContent = originalText;
            }, 1400);
          } catch (error) {
            button.textContent = "Copy failed";
            window.setTimeout(() => {
              button.textContent = "Copy URL";
            }, 1400);
            void error;
          }
        }
      });
    });
  }

  function bindHeroButtons() {
    document.querySelectorAll("[data-hero-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.heroAction;
        if (action === "google") {
          openServicePath("4000", "/o/oauth2/v2/auth?client_id=example-google-client.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code");
          return;
        }
        if (action === "stripe") {
          openServicePath("4003", "/v1/products");
        }
      });
    });
  }

  function init() {
    bindServiceButtons();
    bindHeroButtons();
    refreshHealth();
    window.setInterval(refreshHealth, healthIntervalMs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
</script>
`;
}

export function renderLandingPage(): string {
  return `
<!DOCTYPE html>
<html lang="en">
${renderHead()}
<body>
  <div class="page-shell">
    <div class="page">
      ${renderNavbar()}
      ${renderHero()}
      ${renderServices()}
      ${renderSystemInfo()}
      ${renderFooter()}
    </div>
  </div>
  ${renderScripts()}
</body>
</html>
`;
}
