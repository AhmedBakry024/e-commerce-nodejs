import { Router } from "express";
import { add_items , delete_item , checkout , viewCart , clearCart , update_quantity } from "../Controllers/cart.controller.js";
import { protect } from "../Middlewares/protect.js";

const CartRoutes = Router()
CartRoutes.use(protect)

CartRoutes.post("/additems" , add_items);
CartRoutes.delete("/deleteitem/:id" , delete_item);
CartRoutes.put("/updatequantity" , update_quantity)
CartRoutes.get("/viewcart" , viewCart)
CartRoutes.get("/clearcart" , clearCart)
CartRoutes.post("/checkout" , checkout)

export default CartRoutes