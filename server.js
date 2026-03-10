import dotenv from "dotenv"
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { dbConnect } from "./Database/dbConnect.js";

import productRoute from "./Routes/product.route.js";
import categoryRoute from "./Routes/category.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRouter from "./Routes/user.route.js";
import CartRoutes from "./Routes/cart.route.js";
import AppErrors from "./Utils/appErrors.js";
import globalErrorHandler from "./Controllers/globalError.controller.js";
await dbConnect(); 

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/categories", categoryRoute);
app.use("/products", productRoute);

//const PORT = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
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