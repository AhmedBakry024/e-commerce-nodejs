import dotenv from "dotenv"
dotenv.config();
import express from "express";

import { dbConnect } from "./Database/dbConnect.js";
// import userRouter from "./Routes/user.route.js";
import CartRoutes from "./Routes/cart.route.js";

await dbConnect(); 

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


// app.use("/api/v1/users", userRouter);
app.use(CartRoutes)

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});