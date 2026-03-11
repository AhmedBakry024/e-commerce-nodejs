import { Router } from "express";
import { add_items , remove_items , checkout } from "../Controllers/cart.controller.js";
import { protect } from "../Middlewares/protect.js";

const CartRoutes = Router()
CartRoutes.use(protect)

CartRoutes.post("/additems" , add_items);
CartRoutes.post("/removeitems" , remove_items);
CartRoutes.post("/checkout" , checkout)

export default CartRoutes