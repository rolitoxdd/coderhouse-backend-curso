const fs = require("fs/promises");
class Archivo {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo; // guardo el nombre del archivo
    this.data = (async () => {
      try {
        const data = await fs.readFile(nombreArchivo, "utf-8"); // esperamos la lectura del texto
        return JSON.parse(data); // transformamos en un objeto el texto
      } catch (err) {
        console.error(err.message); // mostramos el error en pantalla
        return []; // en caso de falla, array vacio
      }
    })();
  }

  async guardar() {
    const data = await this.data; // esperamos que la promesa del constructor se cumpla
    this.data = data.map((p, idx) => ({ ...p, id: idx + 1 })); // agregandole id a cada item
    await fs.writeFile(this.nombreArchivo, JSON.stringify(this.data, null, 2)); // grabando en el archivo, el nuevo objeto con ids
  }
  async leer() {
    console.log(await this.data); //muestro la informacion del archivo
    if (this.data.length == 0) {
      return this.data; // en caso de archivo vacio o inexistente, muestro array vacio
    }
  }
  async borrar() {
    try {
      this.data = []; // cambio la data a array vacio
      await fs.rm(this.nombreArchivo); //elimino archivo
    } catch (err) {
      console.error(err.message); // en caso de error muestro el mensaje en pantalla
    }
  }
}

const archivo1 = new Archivo("./productos.txt");
archivo1.leer(); //<-- debe mostrar el archivo productos original (sin ids)
archivo1.guardar(); //<-- pone las ids a productos
archivo1.leer(); //<-- debe mostrar el archivo productos con ids

//archivo1.borrar() // <-- debiese eliminar el archivo
