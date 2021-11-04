const saludo = document.querySelector("#saludo");

(async () => {
  const res = await fetch("/login", { method: "POST" });
  const data = await res.json();
  saludo.innerHTML = `Bienvenido ${data.name}`;
})();
