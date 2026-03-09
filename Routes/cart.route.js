import { Router } from "express";
import { add_items } from "../Controllers/cart.controller.js";
import { protect } from "../Middlewares/protect.js";

const CartRoutes = Router()
CartRoutes.use(protect)

CartRoutes.post("/additems" , protect ,  add_items);

export default CartRoutes