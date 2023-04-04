import mysql from "mysql2";
import http from "node:http";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  database: "nodejs",
});

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/user") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const user = JSON.parse(body);

      const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      const values = [user.name, user.email, user.password];

      connection.query(sql, values, (err, result) => {
        if (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.write(JSON.stringify({ error: "Ocorreu um error" }));
          res.end();
        } else {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.write(JSON.stringify(user));
          res.end();
        }
      });
    });
  } else if (req.method === "GET" && req.url === "/users") {
    const sql = "SELECT * FROM users";

    connection.query(sql, (err, result) => {
      if (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ error: "Ocorreu um error" }));
        res.end();
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(result));
        res.end();
      }
    });
  } else if (req.method === "PUT" && req.url.startsWith("/users/")) {
    const userId = req.url.substring(7);
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const user = JSON.parse(body);

      const sql =
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
      const values = [user.name, user.email, user.password, userId];

      connection.query(sql, values, (err, result) => {
        if (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.write(JSON.stringify({ error: "Ocorreu um error" }));
          res.end();
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.write(JSON.stringify(user));
          res.end();
        }
      });
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/users/")) {
    const userId = req.url.substring(7);

    const sql = "DELETE FROM users WHERE id = ?";
    const values = [userId];

    connection.query(sql, values, (err, result) => {
      if (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ error: "Ocorreu um error" }));
        res.end();
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ message: "Usuário deletado" }));
        res.end();
      }
    });
  }
});

server.listen(4001, () =>
  console.log("Server is running at http://localhost:4001")
);
