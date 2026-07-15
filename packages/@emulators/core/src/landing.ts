const SERVICES = [
  { name: "Google", port: 4000, color: "#4285F4" },
  { name: "Apple", port: 4001, color: "#111111" },
  { name: "Resend", port: 4002, color: "#000000" },
  { name: "Stripe", port: 4003, color: "#635BFF" },
  { name: "Twilio", port: 4004, color: "#F22F46" },
];

function renderHead(): string {
  return `
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Emulate Local Platform</title>

<style>
:root{
    --bg:#0f172a;
    --card:#1e293b;
    --card-hover:#334155;
    --primary:#3b82f6;
    --text:#f8fafc;
    --muted:#94a3b8;
    --border:#334155;
    --success:#22c55e;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Inter,Segoe UI,Arial,sans-serif;
}

body{
    background:linear-gradient(135deg,#020617,#0f172a,#111827);
    color:var(--text);
    min-height:100vh;
    padding:50px;
}

.hero{
    text-align:center;
    margin-bottom:50px;
}

.hero h1{
    font-size:3rem;
    margin-bottom:12px;
}

.hero p{
    color:var(--muted);
    font-size:1.1rem;
}

.services{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
    gap:25px;
    margin-bottom:50px;
}

.card{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:18px;
    padding:25px;
    transition:.25s;
}

.card:hover{
    transform:translateY(-6px);
    background:var(--card-hover);
    box-shadow:0 15px 40px rgba(0,0,0,.35);
}

.status{
    width:12px;
    height:12px;
    border-radius:50%;
    background:var(--success);
    margin-bottom:18px;
}

.card h2{
    margin-bottom:10px;
}

.card p{
    color:var(--muted);
    margin-bottom:22px;
}

.buttons{
    display:flex;
    gap:10px;
}

button{
    flex:1;
    border:none;
    cursor:pointer;
    padding:12px;
    border-radius:10px;
    background:var(--primary);
    color:white;
    font-weight:600;
    transition:.2s;
}

button:hover{
    opacity:.9;
}

.system{
    background:var(--card);
    border-radius:18px;
    padding:30px;
    border:1px solid var(--border);
    margin-bottom:50px;
}

.system h2{
    margin-bottom:20px;
}

.system ul{
    list-style:none;
}

.system li{
    padding:10px 0;
    border-bottom:1px solid var(--border);
    color:var(--muted);
}

footer{
    text-align:center;
    color:var(--muted);
    margin-top:40px;
}
</style>

</head>
`;
}

function renderHero(): string {
  return `
<section class="hero">
  <h1>🚀 Emulate Local Platform</h1>
  <p>Local API Simulation for Developers</p>
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

function renderServiceCard(service: typeof SERVICES[number]): string {
  return `
<div class="card">

  <div class="status"></div>

  <h2>${service.name}</h2>

  <p>localhost:${service.port}</p>

  <<div class="buttons">
    <button
        class="open-btn"
        data-port="${service.port}">
        🌐 Open
    </button>

    <button
        class="copy-btn"
        data-port="${service.port}">
        📋 Copy
    </button>
  </div>

</div>
`;
}

function renderSystemInfo(): string {
  return `
<section class="system">

<h2>System Information</h2>

<ul>

<li>Docker : Healthy</li>

<li>Version : v0.8.0</li>

<li>Runtime : Node.js</li>

<li>Container : Running</li>

</ul>

</section>
`;
}

function renderFooter(): string {
  return `
<footer>

<p>© Emulate Local Platform</p>

</footer>
`;
}

function renderScripts(): string {
  return `
<script>

function buildUrl(port) {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    return protocol + "//" + host + ":" + port;
}

document.querySelectorAll(".open-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        const port = btn.dataset.port;

        window.open(buildUrl(port), "_blank");

    });

});

document.querySelectorAll(".copy-btn").forEach(btn => {

    btn.addEventListener("click", async () => {

        const port = btn.dataset.port;

        const url = buildUrl(port);

        await navigator.clipboard.writeText(url);

        const original = btn.innerHTML;

        btn.innerHTML = "✅ Copied";

        setTimeout(() => {

            btn.innerHTML = original;

        },1500);

    });

});

</script>
`;
}

export function renderLandingPage(): string {
  return `
<!DOCTYPE html>

<html lang="en">

${renderHead()}

<body>

${renderHero()}

${renderServices()}

${renderSystemInfo()}

${renderFooter()}

${renderScripts()}

</body>

</html>
`;
}