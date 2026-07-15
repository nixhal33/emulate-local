export function renderLandingPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Emulate</title>

<style>
body{
    margin:0;
    background:#0f172a;
    color:white;
    font-family:system-ui;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.card{
    width:700px;
    background:#111827;
    border-radius:20px;
    padding:40px;
    text-align:center;
}

h1{
    margin-top:0;
    font-size:42px;
}

p{
    color:#9ca3af;
}
</style>

</head>

<body>

<div class="card">

<h1>👋 Welcome Stranger</h1>

<p>
Emulate Local Service Hub
</p>

<p>
Landing page integration successful.
</p>

</div>

</body>

</html>
`;
}