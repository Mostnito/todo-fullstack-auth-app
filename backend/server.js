const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users");
    console.log("Fetched users:", result.rows);
    res.json(result.rows);
});

app.post("/register", async (req, res) =>{
    const {email, password} = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const MailExist = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
    if(MailExist.rows.length > 0){
        console.log("Email already exists");
        return res.status(400).json({error: "Email already exists"});
    }

    const regis = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hashPassword]);
    console.log("Created user:", regis.rows[0]);
    res.json(regis.rows[0]);
    
});

app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
});