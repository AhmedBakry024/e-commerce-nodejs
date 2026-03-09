import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                if(decoded.role == "user") {
                let usercart = await User.find(cart_items)
                
                res.json({message : "added successfully" , data : addcart})
        }            
        else{
                return res.json({message : "You don't have permission to add items in cart"})
        }           
        }
        catch(err){
                return res.json({message : "Invalid Token"})

        }
        
}