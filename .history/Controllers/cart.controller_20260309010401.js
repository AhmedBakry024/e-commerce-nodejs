import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"
import Product from "../Models/product.model.js"

const productExists = async (productname)=>{
        let productdata = await Product.findOne({name : productname})
        if(productdata == null)
                return null
        else
                return productdata
}

const stockCheck = async (productname, productquantity) =>{
        let productinfo = await productExists(productname)
        if(productinfo){
                let stockAvailability = productinfo.stock
                if(stockAvailability >= productquantity)
                return productinfo
        else
                return `Only ${stockAvailability} items in the stock from ${productinfo.name}`
        }
        else
                return null
        
}

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        let flag = false;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                if(decoded.role == "user") {
                let user = await User.findById(decoded.id)
                let items  = Array.isArray(req.body) ? req.body : [req.body]
                items.forEach(async element => {
                        if (user.cart_items.has(element.productname)){
                                let currentquantity = user.cart_items.get(element.productname)
                                let checkedquantity = await stockCheck(element.productname , currentquantity + element.quantity)
                                if(checkedquantity != null){
                                        user.cart_items.set(element.productname , currentquantity + element.quantity)
                                }
                                else{
                                        return res.json({message : checked})
                                }
                                
                        }
                        else{
                                let checked = await stockCheck(element.productname , element.quantity)
                                if(checked != null){
                                      user.cart_items.set(element.productname , element.quantity)
                                }
                                else{
                                        return res.json({message : checked})
                                }
                        }
                        await user.save();
                        if (items.length == user.cart_items.size) {
                                flag = true
                        }
                });
                if (flag == true)
                let cart_data = Object.fromEntries(user.cart_items)

                return res.status(200).json({message : "items added successfully" , cart: cart_data })
}            
        else{
                return res.status(403).json({message : "You don't have permission to add items in cart"})
        }           
        }
        catch(err){
                return res.status(401).json({message : "Invalid Token"})

        }
        
}