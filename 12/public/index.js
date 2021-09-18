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
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  socket.emit("new-item", data);
  form.reset();
});
