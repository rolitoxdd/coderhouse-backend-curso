let schemaAuthor = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "id" }
);
let schemaMsg = new normalizr.schema.Entity(
  "mensaje",
  {
    author: schemaAuthor,
  },
  { idAttribute: "_id" }
);
let schemaMsgList = new normalizr.schema.Entity(
  "mensajes",
  {
    mensajes: [schemaMsg],
  },
  { idAttribute: "id" }
);

const tituloChat = document.querySelector("#titulo-chat");
const dataContainer = document.querySelector(".data-container");
let totalItems = [];
let totalMessages = [];
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
  console.log();
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  socket.emit("new-item", data);
  productForm.reset();
});

const chatForm = document.querySelector("#chat-form");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const author = {
    id: data.email,
    nombre: data.nombre,
    apellido: data.apellido,
    edad: data.edad,
    alias: data.alias,
    avatar: data.avatar,
  };
  const newMessage = { ...author, mensaje: data.mensaje };
  socket.emit("mensaje", newMessage);
});

socket.on("mensaje", (msg) => {
  const mensajes = document.querySelector("#mensajes");
  mensajes.innerHTML += `
  <li class="list-group-item"><b>${msg.id}</b> <span>${msg.fecha}</span> <i>${msg.mensaje}</i> </li>
  `;
});

socket.on("all-chat", (data) => {
  totalMessages = normalizr.denormalize(
    data.result,
    schemaMsgList,
    data.entities
  );
  window.data = data;
  tituloChat.innerHTML += ` (Compresión: ${parseInt(
    (100 *
      (JSON.stringify(totalMessages).length - JSON.stringify(data).length)) /
      JSON.stringify(totalMessages).length
  )}) % `;
  // console.log("denormalized:", totalMessages);

  // console.log(normalizr.normalize(totalMessages, schemaMsgList));
  const mensajes = document.querySelector("#mensajes");
  totalMessages.mensajes.forEach((msg) => {
    mensajes.innerHTML += `
  <li class="list-group-item"><b>${msg.author.id}</b> <span>${msg.fecha}</span> <i>${msg.mensaje}</i> </li>
  `;
  });
});
