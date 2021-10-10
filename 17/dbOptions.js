const mysql = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "ecommerce",
  },
};

const sqlite = {
  client: "sqlite3",
  connection: {
    filename: "./DB/mydb.sqlite",
  },
  useNullAsDefault: true,
};

module.exports = { mysql, sqlite };
