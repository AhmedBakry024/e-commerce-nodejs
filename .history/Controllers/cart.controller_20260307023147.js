import User from "../Models/user.model.js"

export const add_items = async(req,res) =>{
        console.log(req.body)
        let addcart = await User.create(req.body)
        res.json({message : "added successfully"})
}