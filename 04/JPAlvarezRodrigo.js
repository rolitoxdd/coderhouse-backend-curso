const { randomUUID } = require("crypto");

function* generadorAzar() {
  while (true) {
    yield Math.random();
  }
}

const azar = generadorAzar();

const acceso = (tiempo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const numero = azar.next().value;
      if (numero > 0.2) resolve(["ok", { id: randomUUID() }]);
      else reject("error");
    }, tiempo);
  });
};

const thenHandler = ([value, obj]) => console.log(value, obj);
const times = [3, 2, 5, 1, 4];

for (let t of times) {
  acceso(t * 1000)
    .then(thenHandler)
    .catch(console.error)
    .finally(() => console.log(azar.next().value));
}

for (let i = 0; i < 25; i++) {
  console.log(azar.next().value);
}
