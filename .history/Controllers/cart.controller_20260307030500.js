import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        let verifiedtoken = jwt.verify(token ,process.env.) 
        let addcart = await User.create(req.body)
        res.json({message : "added successfully" , data : addcart})

}