const apiDogs = require("./Dogs.json");
// const myDogs

// Mientras se resuelven los ejercicios, pensar o descubrir en qué momentos se pueden producir errores y anticiparlos lanzado un error con un mensaje adecuado. Estos mensajes se pueden guardar en constantes, para poder utilizarlas a nivel global.

/* Guardar en apiDogsResult el resultado de aplicar una función al array de apiDogs, que devuelva un nuevo array de objetos con sólo la siguiente información de los perros: id, name, weight(metric), height(metric), image_url, temperament.
 */
const apiDogsResult = apiDogs.map(
  ({
    id,
    name,
    weight: { metric: weight },
    height: { metric: height },
    image: { url: image_url },
    temperament,
  }) => ({ id, name, weight, height, image_url, temperament })
);

/* Crear una función que permita filtrar un array con el formato de apiDogsResult según cualquier criterio, es decir, por: id, name, weight, height, image_url y temperament. Es decir, que los filtros se concatenan. Recibirá como parámetro un objeto que contendrá como propiedades estos criterios de filtro y como valores lo que estamos buscando. Debe filtrar sin importar mayúsculas ni minúsculas.
Ejemplo: filterDogs(apiDogsResult, {name: "dog", temperament: "dutiful"}) ---> 
[
{
"id": 3,
"name": "African Hunting Dog",
"weight": "20 - 30",
"height": "76",
"life_span": "11 years",
"image_url": "https://cdn2.thedogapi.com/images/rkiByec47.jpg",
"temperament": "Wild, Hardworking, Dutiful"
}, 
{
"id": 7,
"name": "Alapaha Blue Blood Bulldog",
"weight": "25 - 41",
"height": "46 - 61",
"life_span": "12 - 13 years",
"image_url": "https://cdn2.thedogapi.com/images/33mJ-V3RX.jpg",
"temperament": "Loving, Protective, Trainable, Dutiful, Responsible"
},
...]
*/

function filterDogs(dogs, filters) {
  let filteredDogs = [...dogs];
  for (let criterion in filters) {
    filteredDogs = filteredDogs.filter((dog) => {
      const dogData = dog[criterion].toUpperCase();
      const filterData = filters[criterion].toUpperCase();
      return dogData.includes(filterData);
    });
  }
  return filteredDogs;
}
// console.log(filterDogs(apiDogsResult, { name: "dog", temperament: "dutiful" })); // da ok

/* Crear una función de ordenamiento que recibirá como parámetros:
array : un array con el formato de apiDogsResult, que puede haber sido filtrado por la función anterior.
propiedad: una string cuyo valor se corresponde con el nombre de cualquier propiedad dentro de cada objeto del array. Por ejemplo: "name", "temperament", "weight", etc.
direction: una string cuyo valor puede ser "ASC" o "DESC", que determinará si el resultado final se mostrará en orden ascendente o descendente. Por defecto ASC.
Considerar que por defecto, el array está ordenado según id y name.
Nota: NO utilizar el método sort propio de los arrays.
Ejemplo:
mySortArray(filterDogs(apiDogsResult, {name: "dog", temperament: "dutiful"}) , "weight", "DESC") ---> 
[
{
"id": 7,
"name": "Alapaha Blue Blood Bulldog",
"weight": "25 - 41",
"height": "46 - 61",
"life_span": "12 - 13 years",
"image_url": "https://cdn2.thedogapi.com/images/33mJ-V3RX.jpg",
"temperament": "Loving, Protective, Trainable, Dutiful, Responsible"
},
{
"id": 3,
"name": "African Hunting Dog",
"weight": "20 - 30",
"height": "76",
"life_span": "11 years",
"image_url": "https://cdn2.thedogapi.com/images/rkiByec47.jpg",
"temperament": "Wild, Hardworking, Dutiful"
}, 
...]
*/

function mySortArray(array, prop, direction) {}

/* Guardar en la constante temperamentos el resultado de aplicar una función al array de apiDogs, que retorne en un nuevo array todos los temperamentos de los perros, sin repetir y sin espacios sobrantes.
 Ejemplo=  ['Stubborn', 'Curious', 'Playful', 'Adventurous', 'Active'] */

const temperamentos = apiDogs.reduce((prevTemperaments, current) => {
  const temperaments = current.temperament?.split(", ") || [];
  for (let t of temperaments) {
    if (!prevTemperaments.includes(t)) {
      prevTemperaments.push(t);
    }
  }
  return prevTemperaments;
}, []);
// console.log(temperamentos); // al parecer funciona

/* Crear una clase o función constructora Breed, cuyo constructor contendrá:
id: Debe autogenerarse a partir de una función que asegure su unicidad. No puede nunca coincidir con el id del array de apiDogsResult.
name: STRING, sólo caracteres de texto, no puede ser nulo ni undefined. 
weight: STRING por defecto es null. Sólo puede contener un guión medio.
height: STRING por defecto es null. Sólo puede contener un guión medio.
temperament: STRING por defecto es null. Se reciben por parámetro en un array de strings, deben estar incluidos en el array de temperamentos y guardarse como cadena, separados por coma.
image_url: STRING por defecto es null. Formato de URL válido. 

- Breed debe tener los siguientes métodos:
- validator: asegura que los valores pasados por parámetros cumplan los requisitos antes de crear o modificar el objeto, de lo contrario lanzar un mensaje adecuado.
- update: actualiza los valores del Dog, por lo cual recibe por parámetro un objeto cuyas propiedades pueden ser name, weight, height e image_url y sus valores deseados, exceptuando el id, que debe ser inmutable. Sólo modifica las propiedades que se soliciten en el objeto. Está sujeto a validación.
*/
const { randomUUID } = require("crypto");
function Breed(
  name,
  weight = null,
  height = null,
  temperament = null,
  image_url = null
) {
  this.id = randomUUID(); //https://nodejs.org/api/crypto.html#crypto_crypto_randomuuid_options
  this.name = name;
  this.weight = weight;
  this.height = height;
  this.temperament = temperament.join(", ");
  this.image_url = image_url;
}
Breed.prototype.validator = function (
  name,
  weight,
  height,
  temperament,
  image_url
) {
  if (typeof name !== "string")
    throw new Error("el parametro name solo debe ser texto");
  if (
    !(typeof weight === "string" || weight === null) || // weight debe ser string o nulo
    weight
      .split("")
      .reduce((prev, current) => (current === "-" ? prev + 1 : prev), 0) > 1
  )
    throw new Error("weight debe tener menos de un guión medio");
  if (
    !(typeof height === "string" || height === null) || // height debe ser string o nulo
    height
      .split("")
      .reduce((prev, current) => (current === "-" ? prev + 1 : prev), 0) > 1
  )
    throw new Error("height debe tener menos de un guión medio");
};

/* Crear una función que permita agregar al array de myDogs una nueva raza a partir de la clase Breed.
 */

function addBreed() {}

/* Crear una función que permita eliminar del array de myDogs una raza según su id.
 */

function deleteBreed() {}

/* Crear una función que permita actualizar del array de myDogs una raza según su id.
 */
function updateBreed() {}

/* Crear una función que mostrará el resultado final y recibirá como parámetros:
array: un array de razas que puede ser apiDogsResult, myDogs o una concatenación de ambos, que puede haber sido filtrado y/u ordenado previamente.
offset: NUMBER cantidad de elementos que excluyo del array resultante, a partir del primer índice.
limit: NUMBER cantidad máxima de elementos a mostrar en el array resultante.
Por ejemplo, showResult(mySortArray(filterDogs(apiDogsResult, {name: "dog", temperament: "dutiful"}), "weight", "DESC") , 0 , 10) --> muestra los primeros 10 resultados de filtrar apiDogsResult por name "dog" y temperament "dutiful" y ordernarlos luego por "weight" de forma descendiente.
*/

function showResult() {}

/* Momento de probar lo que hicimos!
1) Mostrar los primeros 5 resultados de ordernar apiDogsResult por temperament, de forma DESC.
2) Mostrar todos los resultados de filtrar apiDogsResult por {name: "dog", temperament:"curious"} ordenados por name ASC.
3) Ver los mensajes de error que se arrojan al intentar crear las siguientes razas con addBreed:
- name: "Prueba123", weight: "5, 1", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: ["Sociable", "Playful"].
- name: "Prueba", weight: "5, 1", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: ["Sociable", "Playful"].
- name: "Prueba", weight: "5, 1", height: "20 - 50", image_url: "lalala", temperament: ["Sociable", "Playful"].
- name: "Prueba", weight: "5, 1", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: ["lalala"].
- name: "Prueba", weight: "5, 1", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: "lalala".

4) Crear las siguientes razas con addBreed:
- name: "Perrunis", weight: "2 - 5", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: [Sociable, Playful].
- name: "Pichicho", weight: "2 - 5", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: [Sociable, Playful].
- name: "Perritus", weight: "2 - 5", height: "20 - 50", image_url: "https://pics.me.me/no-compres-perro-de-raza-adopta-un-perro-sin-casa-29284553.png", temperament: [Sociable, Playful].

4) Mostrar todos los resultados de filtrar apiDogsResult concatenado con myDogs, según {name: "Per"}, ordernar de forma ASC.

5) Obtener el id de la raza cuyo nombre es Perritus y luego eliminarlo del array de myDogs.

6) Obtener el id de la raza cuyo nombre es Perritus y luego modificarle el nombre dentro del array de myDogs.

*/
