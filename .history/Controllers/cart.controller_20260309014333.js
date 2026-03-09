import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"
import Product from "../Models/product.model.js"

let errors_quantity = []
let errors_product = []

const productExists = async (productname)=>{
        let productdata = await Product.findOne({name : productname})
        if(productdata == null){
                return (`${productname} not found`)
        }
        else
                return productdata
}

const stockCheck = async (productname, productquantity) =>{
        let productinfo = await productExists(productname)
        if(productinfo != `${productname} not found`){
                let stockAvailability = productinfo.stock
                if(stockAvailability >= productquantity)
                return productinfo
        else{
                return(`Only ${stockAvailability} items in the stock from ${productinfo.name}`)
                return "not available"
        }
        }
        else
                return null
        
}

export const add_items = async(req,res) =>{
        let token  = req.headers.token;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                if(decoded.role == "user") {
                let user = await User.findById(decoded.id)
                let items  = Array.isArray(req.body) ? req.body : [req.body]
                for(let item of items){
                        if (user.cart_items.has(item.productname)){
                                let currentquantity = user.cart_items.get(item.productname)
                                let checkedquantity = await stockCheck(item.productname , currentquantity + item.quantity)
                                if(!checkedquantity in (null , "not available")){
                                        user.cart_items.set(item.productname , currentquantity + item.quantity)
                                }
                        }
                        else{
                                let checked = await stockCheck(item.productname , item.quantity)
                                if(!checked in (null , "not available")){
                                      user.cart_items.set(item.productname , item.quantity)
                                }
                        }
                };
                await user.save();
                let cart_data = Object.fromEntries(user.cart_items)

                if (errors_product.length == 0 && errors_quantity.length == 0)
                        return res.status(200).json({message : "All items added successfully" , cart: cart_data })
                else if(errors_product.length == 0 && errors_quantity.length != 0){
                        return res.status(200).json({message : "The rest of the items added successfull" , data : errors_quantity})
                }
                else if(errors_product.length != 0 && errors_quantity.length == 0){
                        return res.status(401).json({data : errors_product})
                }
                else{
                        return res.status(200).json({notfoundproducts : errors_product , fewquantity : errors_quantity})
                }
}            
        else{
                return res.status(403).json({message : "You don't have permission to add items in cart"})
        }           
        }
        catch(err){
                return res.status(401).json({message : "Invalid Token"})

        }
        
}