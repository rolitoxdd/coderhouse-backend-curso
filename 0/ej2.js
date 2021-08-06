var valores = [true, 5, false, "hola", "adios", 2];

const masChars = (arr) => {
  var elementosTexto = valores.filter((v) => typeof v === "string");
  var numChars = elementosTexto.map((x) => x.length);
  const index = numChars.indexOf(Math.max(...numChars));
  return elementosTexto[index];
};
console.log(masChars(valores));
