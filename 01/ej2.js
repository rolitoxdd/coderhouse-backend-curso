class Usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }

  getFullName() {
    return `${this.nombre} ${this.apellido}`;
  }

  addMascota(mascota) {
    this.mascotas.push(mascota);
  }

  getMascotas() {
    return this.mascotas.length;
  }

  addBook(book, autor) {
    this.libros.push({ autor, nombre: book });
  }
  getBooks() {
    return this.libros.map((l) => l.nombre);
  }
}

const test = new Usuario(
  "Lionel",
  "Messi",
  [
    { nombre: "Dune", autor: "Frank Herbert" },
    { nombre: "Infinite Jest", autor: "DFW" },
  ],
  ["Pelusa", "Juancho", "Mila"]
);
console.log(test.getFullName());
test.addMascota("Pluto");
console.log(test.getMascotas());
test.addBook("2666", "Roberto Bolaño");
console.log(test.getBooks());
