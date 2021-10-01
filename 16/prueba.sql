CREATE DATABASE prueba;

CREATE TABLE prueba.items(
    nombre VARCHAR(20) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    stock INT UNSIGNED ,
    id INT PRIMARY KEY AUTO_INCREMENT
);

INSERT INTO prueba.items(nombre, categoria, stock)
VALUES ('fideos', 'harina', 20),
    ('leche', 'lacteos', 30),
    ('crema', 'lacteos', 15);