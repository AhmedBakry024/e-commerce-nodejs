import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"


export const givetoken = async(req , res) =>{
        let token = jwt.sign()
}
export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        let verifiedtoken = jwt.verify(token ,process.env.JWT_SECRET) 
        let addcart = await User.create(req.body)
        res.json({message : "added successfully" , data : addcart})

}