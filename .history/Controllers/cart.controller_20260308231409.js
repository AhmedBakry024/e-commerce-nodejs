import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                if(decoded.role == "user") {
                let user = await User.findById(decoded.id)
                if(Array.isArray(req.body)){
                req.body.forEach(element => {
                        if (user.cart_items.has(element.productname)){
                                let currentquantity = user.cart_items.get(element.productname)
                                user.cart_items.set(element.productname , currentquantity + element.quantity)
                        }
                        else{
                                user.cart_items.set(element.productname , element.quantity)
                        }
                });
                await user.save();
                cart_data = Object.fromEntries(user.cart_items)
                return res.json({message : "items added successfully" , cart: cart_data })
        }
        else{
                if (user.cart_items.has(req.body.productname)){
                                let currentquantity = user.cart_items.get(req.body.productname)
                                user.cart_items.set(req.body.productname , currentquantity + req.body.quantity)
                        }
                        else{
                                user.cart_items.set(req.body.productname , req.body.quantity)
                        }
                await user.save();
                let cart_data = Object.fromEntries(user.cart_items)
                return res.json({message : "items added successfully" , cart: cart_data })

        }
}            
        else{
                return res.json({message : "You don't have permission to add items in cart"})
        }           
        }
        catch(err){
                return res.json({message : "Invalid Token"})

        }
        
}