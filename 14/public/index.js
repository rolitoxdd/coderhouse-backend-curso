const dataContainer = document.querySelector(".data-container");
let totalItems = [];
const socket = io();
socket.on("items", (items) => {
  totalItems = items;
  if (totalItems.length === 0) {
    dataContainer.innerHTML = `
      <div class="alert alert-warning" role="alert">
        La lista está vacia
      </div>`;
  } else {
    const tableBoilerplate = `
      <table class="table">
        <thead>
            <tr>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">thumbnail</th>
            </tr>
        </thead>
        <tbody>`;
    const table = (dataContainer.innerHTML =
      totalItems.reduce(
        (prev, item) =>
          prev +
          `
      <tr>
        <td>${item.title}</td>
        <td>$${item.price}</td>
        <td><img width=50 src="${item.thumbnail}" alt=""></td>
      </tr>
      `,
        tableBoilerplate
      ) + `</tbody></table>`);
    dataContainer.innerHTML = table;
  }
});

const productForm = document.querySelector("#product-form");
productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  socket.emit("new-item", data);
  productForm.reset();
});

const chatForm = document.querySelector("#chat-form");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  socket.emit("mensaje", data);
});
socket.on("mensaje", (msg) => {
  const mensajes = document.querySelector("#mensajes");
  mensajes.innerHTML += `
  <li class="list-group-item"><b>${msg.email}</b> <span>${msg.fecha}</span> <i>${msg.mensaje}</i> </li>
  `;
});

socket.on("all-chat", (data) => {
  const mensajes = document.querySelector("#mensajes");
  data.forEach((msg) => {
    mensajes.innerHTML += `
  <li class="list-group-item"><b>${msg.email}</b> <span>${msg.fecha}</span> <i>${msg.mensaje}</i> </li>
  `;
  });
});
