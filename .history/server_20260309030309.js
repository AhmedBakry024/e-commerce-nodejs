import dotenv from "dotenv"
dotenv.config();
import express from "express";

import { dbConnect } from "./Database/dbConnect.js";
import userRouter from "./Routes/user.route.js";
import CartRoutes from "./Routes/cart.route.js";
import AppErrors from "./Utils/appErrors.js";
import globalErrorHandler from "./Controllers/globalError.controller.js";
>>>>>>> main

await dbConnect(); 

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart",CartRoutes)

app.use((req, res, next) => {
  next(new AppErrors(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});