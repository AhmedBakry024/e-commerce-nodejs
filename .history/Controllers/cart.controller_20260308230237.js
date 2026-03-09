import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                if(decoded.role == "user") {
                let user = await User.findById(decoded.id)
                let usercart = user.cart_items
                req.body.forEach(element => {
                        if (user.cart_items.has(element.productname)){
                                let currentquantity = user.cart_items.get(element.productname)
                                usercart.set(element.productname , currentquantity + element.quantity)
                        }
                        else{
                                usercart.set(element.productname , element.quantity)
                        }
                });
                await user.save()
                return res.json({message : "items added successfully" , cart:  })
        }            
        else{
                return res.json({message : "You don't have permission to add items in cart"})
        }           
        }
        catch(err){
                return res.json({message : "Invalid Token"})

        }
        
}