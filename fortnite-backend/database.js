import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


// export const db = mysql.createPool({
//   host:   "localhost",
//   user:   "root",
//   password:  "123456",
//   database:  "fortniteprojeto",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Teste de conexão
(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    console.log("✅ Conectado ao banco MySQL com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco MySQL:", error);
  }
})();
