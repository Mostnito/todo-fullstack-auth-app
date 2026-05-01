const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if (!token || !authHeader){
        console.log("No token");
        return res.status(401).json({error: "No token"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.user = decoded;
        next();
    } catch (err){
        console.log("Invalid token",token);
        return res.status(401).json({error: "Invalid token"})
    }
}


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

app.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(user.rows.length === 0){
        console.log("User not found");
        return res.status(400).json({error: "User not found"});
    } else{
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!validPassword){
            console.log("Invalid password");
            return res.status(400).json({error: "Invalid password"});
        }
    }
    const token = jwt.sign({id: user.rows[0].id},process.env.JWT_SECRET_KEY,{expiresIn: "15m"});
    console.log("User logged in:", email);
    console.log("Generated JWT token:", token);
    res.json({token});
});

app.get("/todo", authenticateToken, async(req,res)=>{
    console.log("Fetching todos for user ID:", req.user.id);
    const userId = req.user.id;
    const todos = await pool.query("SELECT * FROM todolist WHERE users_id=$1 ORDER BY id",[userId]);
    console.log("Todo",todos.rows);
    res.json(todos.rows);
});

app.post("/todo/create", authenticateToken, async(req,res)=>{
    console.log("Creating todo for user ID:", req.user.id);
    const userId = req.user.id;
    const {topic, des} = req.body;
    const newTodo = await pool.query("INSERT INTO todolist (users_id, topic, des,status) VALUES ($1, $2, $3, 'progress') RETURNING *",[userId, topic,des])
    console.log("Created todo for user ID:", req.user.id, "Todo:", newTodo.rows[0]);
    res.json(newTodo.rows[0]);
});

app.delete("/todo/delete/:id", authenticateToken, async(req,res)=>{
    console.log("Deleting todo for user ID:", req.user.id);
    const userId = req.user.id;
    const {id} = req.params;
    const del = await pool.query("DELETE FROM todolist WHERE id=$1 AND users_id=$2 RETURNING *",[id,userId]);
    console.log("Deleted todo for user ID:", req.user.id, "Todo ID:", id);
    res.json(del.rows[0]);
});

app.put("/todo/update/:id", authenticateToken, async(req,res)=>{
    console.log("Updating todo for user ID:", req.user.id);
    const userId = req.user.id;
    const {id} = req.params;
    const {status} = req.body;
    const realstatus = status === 'progress' ? 'complete' : 'progress';
    const update = await pool.query("UPDATE todolist SET status=$1 WHERE id=$2 AND users_id=$3 RETURNING *",[realstatus,id,userId]);
    console.log("Updated todo for user ID:", req.user.id, "Todo ID:", id, "New Status:", status);
    res.json(update.rows[0]);
});

app.get("/check", authenticateToken, async (req, res) => {
    console.log("Authenticated user ID:", req.user.id);
    console.log("Token is valid");
    return res.json({message: "Authenticated", userId: req.user.id});
});

app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
});
