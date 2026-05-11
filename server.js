import mysql from "mysql2/promise";
import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import router from "./routes/app.js";


const db = await mysql.createConnection({
  host: "localhost",
  user: "notepad",
  password: "password",
  database: "online_notepad"
});

const app = express();

app.use(express.json());

app.use(router);

app.listen(8080, () => console.log("Running on port 8080!"));