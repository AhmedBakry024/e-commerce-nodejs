import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

export const add_items = async(req,res) =>{
        let token  =  
        let addcart = await User.create(req.body)
        res.json({message : "added successfully" , data : addcart})

}