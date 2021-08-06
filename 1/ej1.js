function Usuario (nombre, apellido, libros, mascotas){
  this.nombre = nombre
  this.apellido = apellido
  this.libros = libros
  this.mascotas = mascotas
}

Usuario.prototype.getFullName = function () {
  return `${this.nombre} ${this.apellido}`
}

Usuario.prototype.addMascota = function (mascota) {
  this.mascotas.push(mascota)
}

Usuario.prototype.getMascotas = function () {
  return this.mascotas.length
}

Usuario.prototype.addBook = function (book, autor) {
  this.libros.push({autor, nombre: book})
}
Usuario.prototype.getBooks = function () {
  return this.libros.map(l => l.nombre)
}

const test = new Usuario('Lionel', 'Messi', [{nombre: 'Dune', autor: 'Frank Herbert'}, {nombre: 'Infinite Jest', autor: 'DFW'}], ['Pelusa', 'Juancho', 'Mila'])
console.log(test.getFullName())
test.addMascota('Pluto')
console.log(test.getMascotas())
test.addBook('2666','Roberto Bolaño')
console.log(test.getBooks())

