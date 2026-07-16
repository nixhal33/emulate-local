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
}

const SERVICES: Service[] = [
   ...
]

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

<div class="stat-card">

<h2>5</h2>

<span>Services</span>

</div>

<div class="stat-card">

<h2>100%</h2>

<span>Local</span>

</div>

<div class="stat-card">

<h2>v0.8.0</h2>

<span>Version</span>

</div>

<div class="stat-card">

<h2>Healthy</h2>

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

    const healthy = SERVICES.filter(s => s.status === "Healthy").length;

    return `

<section class="system">

    <h2>

        System Information

    </h2>

    <ul>

        <li>

            Running Services : ${healthy}/${SERVICES.length}

        </li>

        <li>

            Docker : Healthy

        </li>

        <li>

            Runtime : Node.js

        </li>

        <li>

            Platform Version : v0.8.0

        </li>

    </ul>

</section>

`;

}

function renderFooter(): string {

    return `

<footer>

    <p>

        Emulate Local Platform • Built with ❤️

    </p>

</footer>

`;

}

function renderScripts(): string {

return `

<script>

function buildUrl(port,path=""){

    return window.location.protocol
        +"//"
        +window.location.hostname
        +":"
        +port
        +path;

}

document.querySelectorAll(".dashboard-btn").forEach(btn=>{

    btn.onclick=()=>{

        window.open(
            buildUrl(
                btn.dataset.port,
                btn.dataset.dashboard
            ),
            "_blank"
        );

    };

});

document.querySelectorAll(".copy-btn").forEach(btn=>{

    btn.onclick=async()=>{

        const url=buildUrl(btn.dataset.port);

        await navigator.clipboard.writeText(url);

        const old=btn.innerHTML;

        btn.innerHTML="Copied";

        setTimeout(()=>{

            btn.innerHTML=old;

        },1500);

    };

});

</script>

`;

}

function renderServiceCard(service: Service): string {

    return `

<div class="card">

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

    <p class="description">

        ${service.description}

    </p>

    <div class="feature-list">

        ${service.features.map(feature => `

            <span class="feature">

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

                ${service.port}

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

</body>

</html>
`;

}