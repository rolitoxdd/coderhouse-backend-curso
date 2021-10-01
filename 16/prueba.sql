-- CREAR BDD LLAMADA 'PRUEBA'
CREATE DATABASE prueba;

-- CREAR TABLA 'ITEMS'
CREATE TABLE prueba.items(
    nombre VARCHAR(20) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    stock INT UNSIGNED ,
    id INT PRIMARY KEY AUTO_INCREMENT
);

-- INSERTAR 3 REGISTROS
INSERT INTO prueba.items(nombre, categoria, stock)
VALUES ('fideos', 'harina', 20),
    ('leche', 'lacteos', 30),
    ('crema', 'lacteos', 15);

-- LISTAR REGISTROS AGREGADOS
SELECT * FROM prueba.items WHERE ID=1 OR ID=2 OR ID=3;

-- BORRAR ITEM CON ID=1
DELETE FROM prueba.items WHERE id=1;

-- ACTUALIZAR STOCK DEL ITEM ID=2 A 45
UPDATE prueba.items SET stock=45 WHERE id=2;

-- LISTAR LOS REGISTROS 
SELECT * FROM prueba.items;
