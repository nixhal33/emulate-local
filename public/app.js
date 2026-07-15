const services = {
  Google: 4000,
  Apple: 4001,
  Resend: 4002,
  Stripe: 4003,
  Twilio: 4004,
};

const protocol = window.location.protocol;
const hostname = window.location.hostname;

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const port = button.dataset.port;
    window.open(`${protocol}//${hostname}:${port}`, "_blank");
  });
});

console.log("🚀 Emulate Gateway Loaded");