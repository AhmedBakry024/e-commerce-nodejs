import { Router } from "express";
import { add_items } from "../Controllers/cart.controller.js";


const CartRoutes = Router()

CartRoutes.post("/additems" , add_items);

export default CartRoutes