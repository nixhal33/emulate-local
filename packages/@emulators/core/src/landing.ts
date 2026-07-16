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

const SERVICES: ServiceHealth[] = [
  {
    id: "google",
    name: "Google",
    port: 4000,
    color: "#4285F4",

    description: "Google OAuth2, Gmail, Calendar & Drive Emulator",

    features: [
      "OAuth2",
      "Gmail",
      "Calendar",
      "Drive",
    ],

    version: "v0.8.0",

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

    description: "Sign in with Apple Emulator",

    features: [
      "OAuth",
      "OpenID",
      "JWKS",
    ],

    version: "v0.8.0",

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

    description: "Transactional Email Emulator",

    features: [
      "Emails",
      "Inbox",
      "Domains",
      "Contacts",
    ],

    version: "v0.8.0",

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

    description: "Payments & Checkout Emulator",

    features: [
      "Customers",
      "Products",
      "Payments",
      "Checkout",
    ],

    version: "v0.8.0",

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

    description: "Messaging, Verify & Calls Emulator",

    features: [
      "SMS",
      "Verify",
      "Calls",
      "Inspector",
    ],

    version: "v0.8.0",

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

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
/>

<title>Emulate Local Platform</title>

<style>

:root{

--bg:#0f172a;

--surface:#1e293b;

--surface-hover:#334155;

--border:#334155;

--text:#f8fafc;

--muted:#94a3b8;

--primary:#2563eb;

--success:#22c55e;

}

*{

margin:0;

padding:0;

box-sizing:border-box;

font-family:
Inter,
Segoe UI,
Arial,
sans-serif;

}

body{

background:
linear-gradient(
135deg,
#020617,
#0f172a,
#111827
);

color:var(--text);

min-height:100vh;

}

a{

text-decoration:none;

color:inherit;

}

button{

font:inherit;

cursor:pointer;

}

.navbar{

height:72px;

display:flex;

align-items:center;

justify-content:space-between;

padding:0 48px;

border-bottom:1px solid var(--border);

background:rgba(15,23,42,.92);

backdrop-filter:blur(12px);

position:sticky;

top:0;

z-index:100;

}

.logo{

font-size:1.4rem;

font-weight:700;

letter-spacing:.4px;

}

.nav-right{

display:flex;

align-items:center;

gap:18px;

}

.badge{

background:var(--primary);

padding:6px 12px;

border-radius:999px;

font-size:.78rem;

font-weight:600;

}

.status-online{

color:var(--success);

font-weight:600;

font-size:.9rem;

}

.hero{

display:flex;

justify-content:space-between;

align-items:center;

gap:60px;

padding:70px 60px;

}

.hero-left{

flex:1;

}

.hero-left h1{

font-size:3.5rem;

line-height:1.1;

margin-bottom:20px;

}

.hero-left p{

font-size:1.1rem;

color:var(--muted);

line-height:1.8;

max-width:700px;

margin-bottom:35px;

}

.hero-buttons{

display:flex;

gap:16px;

}

.primary-btn{

padding:14px 24px;

background:var(--primary);

border:none;

border-radius:12px;

color:white;

font-weight:700;

}

.primary-btn:hover{

opacity:.9;

}

.secondary-btn{

padding:14px 24px;

background:transparent;

border:1px solid var(--border);

border-radius:12px;

color:white;

}

.secondary-btn:hover{

background:var(--surface);

}

.hero-right{

display:grid;

grid-template-columns:repeat(2,170px);

gap:18px;

}

.stat-card{

background:var(--surface);

border:1px solid var(--border);

border-radius:18px;

padding:28px;

text-align:center;

transition:.25s;

}

.stat-card:hover{

transform:translateY(-4px);

background:var(--surface-hover);

}

.stat-card h2{

font-size:2rem;

margin-bottom:8px;

}

.stat-card span{

color:var(--muted);

}

.card-top{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:18px;
}

.service-icon{
width:18px;
height:18px;
border-radius:5px;
}

.version{
padding:4px 10px;
background:#2563eb;
border-radius:20px;
font-size:.72rem;
font-weight:700;
color:white;
}

.description{
color:var(--muted);
line-height:1.6;
margin:18px 0;
min-height:60px;
}

.feature-list{
display:flex;
flex-wrap:wrap;
gap:8px;
margin-bottom:20px;
}

.feature{
padding:6px 12px;
border-radius:30px;
background:#334155;
font-size:.72rem;
font-weight:600;
color:#e2e8f0;
}

.meta{
display:flex;
justify-content:space-between;
padding:18px 0;
margin-bottom:20px;
border-top:1px solid var(--border);
border-bottom:1px solid var(--border);
}

.meta-title{
display:block;
font-size:.72rem;
margin-bottom:4px;
color:var(--muted);
}

.healthy{
color:#22c55e;
}

.dashboard-btn{
background:#2563eb;
}

.dashboard-btn:hover{
background:#1d4ed8;
}

.docs-btn{
width:100%;
margin-top:12px;
background:#475569;
}

.docs-btn:hover{
background:#334155;
}

.endpoint{

    margin-bottom:18px;

    font-size:.82rem;

    color:#60a5fa;

    font-family:monospace;

}

</style>

</head>
`;
}

function renderNavbar(): string {

return `

<nav class="navbar">

<div class="logo">

🚀 Emulate

</div>

<div class="nav-right">

<span class="badge">

v0.8.0

</span>

<span class="status-online">

● All Services Healthy

</span>

</div>

</nav>

`;

}

function renderHero(): string {

return `

<section class="hero">

<div class="hero-left">

<h1>

Emulate Local Platform

</h1>

<p>

A unified local development environment for modern third-party APIs.
Develop, test and debug integrations without relying on external services.

</p>

<div class="hero-buttons">

<button class="primary-btn">

🚀 Open Dashboard

</button>

<button class="secondary-btn">

📚 Documentation

</button>

</div>

</div>

<div class="hero-right">

<div class="hero-right">

<div class="stat-card">

<h2 id="service-count">-</h2>

<span>Services</span>

</div>

<div class="stat-card">

<h2 id="local-percent">100%</h2>

<span>Local</span>

</div>

<div class="stat-card">

<h2 id="platform-version">-</h2>

<span>Version</span>

</div>

<div class="stat-card">

<h2 id="platform-status">-</h2>

<span>Status</span>

</div>

</div>

</section>

`;

}

function renderServices(): string {

    return `

<section class="services">

    ${SERVICES.map(renderServiceCard).join("")}

</section>

`;

}

function renderSystemInfo(): string {

return `

<section class="system">

<h2>System Information</h2>

<ul>

<li>

Running Services :

<strong id="running-services">-</strong>

</li>

<li>

Docker :

<strong id="docker-status">Healthy</strong>

</li>

<li>

Runtime :

<strong id="runtime">-</strong>

</li>

<li>

Platform Version :

<strong id="system-version">-</strong>

</li>

</ul>

</section>

`;

}

function renderFooter(): string {

    return `

<footer>

    <p>

        Emulate Local Platform • Built with ❤️ By ❤️❤️❤️Nixhal Koirala❤️❤️❤️

    </p>

</footer>

`;

}

function renderScripts(): string {

return `

<script>

function buildUrl(port,path){

    const protocol=window.location.protocol;

    const host=window.location.hostname;

    return protocol+"//"+host+":"+port+path;

}

async function refreshHealth(){

    try{

        const res=await fetch("/health");

        const data=await res.json();

        document.getElementById("service-count").textContent=data.services.length;

        document.getElementById("platform-version").textContent=data.version;

        document.getElementById("platform-status").textContent=data.status;

        document.getElementById("running-services").textContent=
            data.services.length+"/"+data.services.length;

        document.getElementById("runtime").textContent=data.runtime;

        document.getElementById("system-version").textContent=data.version;

    }catch(err){

        console.error(err);

    }

}

refreshHealth();

setInterval(refreshHealth,5000);

document.querySelectorAll(".dashboard-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        const port=btn.dataset.port;

        const dashboard=btn.dataset.dashboard;

        window.open(buildUrl(port,dashboard),"_blank");

    });

});

document.querySelectorAll(".copy-btn").forEach(btn=>{

    btn.addEventListener("click",async()=>{

        const port=btn.dataset.port;

        const url=buildUrl(port,"");

        await navigator.clipboard.writeText(url);

        const original=btn.innerHTML;

        btn.innerHTML="Copied ✓";

        setTimeout(()=>{

            btn.innerHTML=original;

        },1500);

    });

});

</script>

`;

}

function renderServiceCard(service: Service): string {

    return `

<div
    class="card"
    data-port="${service.port}">

    <div class="card-top">

        <div
            class="service-icon"
            style="background:${service.color};">
        </div>

        <span class="version">
            ${service.version}
        </span>

    </div>

    <h2>${service.name}</h2>

    <p class="endpoint">

        http://localhost:${service.port}

    </p>

    <div class="feature-list">

        ${service.features.map(feature => `

            <span
                class="feature"
                style="
                    border:1px solid ${service.color};
                    color:${service.color};
                ">

                ${feature}

            </span>

        `).join("")}

    </div>

    <div class="meta">

        <div>

            <span class="meta-title">

                Port

            </span>

            <strong>

                localhost:${service.port}

            </strong>
        </div>

        <div>

            <span class="meta-title">

                Status

            </span>

            <strong class="healthy">

                ${service.status}

            </strong>

        </div>

    </div>

    <div class="buttons">

        <button
            class="dashboard-btn"
            data-port="${service.port}"
            data-dashboard="${service.dashboard}">

            Dashboard

        </button>

        <button
            class="copy-btn"
            data-port="${service.port}">

            Copy URL

        </button>

    </div>

    <button
        class="docs-btn"
        onclick="window.open('${service.docs}','_blank')">

        Documentation

    </button>

</div>

`;

}

function renderHealthScript(): string {
    return `
    async function checkHealth(){

    const cards=document.querySelectorAll(".card");

    for(const card of cards){

        const port=card.dataset.port;

        const status=card.querySelector(".healthy");

        const indicator=card.querySelector(".service-icon");

        try{

            const res=await fetch(
                window.location.protocol+
                "//"+
                window.location.hostname+
                ":"+
                port
            );

            if(res.ok){

                status.textContent="Healthy";

                indicator.style.opacity="1";

            }else{

                status.textContent="Offline";

                indicator.style.opacity=".3";

            }

        }catch{

            status.textContent="Offline";

            indicator.style.opacity=".3";

        }

    }

}

checkHealth();

setInterval(checkHealth,5000);
`;
}

export function renderLandingPage(): string {

    return `
<!DOCTYPE html>
<html lang="en">

${renderHead()}

<body>

${renderNavbar()}

${renderHero()}

${renderServices()}

${renderSystemInfo()}

${renderFooter()}

${renderScripts()}

${renderHealthScript()}

</body>

</html>
`;

}