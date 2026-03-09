import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                        
        }
        catch(err){
                res.json()

        }

        
}