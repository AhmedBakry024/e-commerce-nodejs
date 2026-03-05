import dotenv from "dotenv"
dotenv.config();
import express from "express";

import { dbConnect } from "./Database/dbConnect.js";

await dbConnect(); 

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});