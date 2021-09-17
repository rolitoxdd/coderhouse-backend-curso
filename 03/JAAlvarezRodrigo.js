const recorrerTexto = (texto, cb, tiempo = 1000) => {
  let i = 0;
  texto = texto.split(" ");
  const id = setInterval(() => {
    if (i == texto.length - 1) {
      console.log(texto[i]);
      clearInterval(id);
      cb(i);
    } else {
      console.log(texto[i++]);
    }
  }, tiempo);
};
recorrerTexto("Árbol hoja salto luz aproximación", (n) => {
  let total = n;
  recorrerTexto(
    "Mueble lana gusto pie",
    (n) => {
      total += n;
      recorrerTexto(
        "Té mar gas mirada",
        (n) => {
          total += n;
          setTimeout(() => {
            console.log("proceso completo");
            console.log(`Palabras totales: ${total}`);
          }, 1000);
        },
        300
      );
    },
    500
  );
});
