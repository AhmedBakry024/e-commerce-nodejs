import User from "../Models/user.model.js"
import jwt from "jsonWebToken"

export const add_items = async(req,res) =>{
        let user  = 
        let addcart = await User.create(req.body)
        res.json({message : "added successfully" , data : addcart})

}