import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"
import Product from "../Models/product.model.js"

const productExists = async (productname)=>{
        let productdata = await Product.findOne({name : productname})
        if(!productdata){
                return `${productname} not found`
        }
        else
                return productdata
}
const stockCheck = async (productname, productquantity) =>{
        let productinfo = await productExists(productname)
        if(typeof productinfo !== "string"){
                let stockAvailability = productinfo.stock
                if(stockAvailability >= productquantity)
                return productinfo
        else{
                return `Only ${stockAvailability} items in the stock from ${productinfo.name}`
        }
        }
        else
                return productinfo
        
}
export const add_items = async(req,res) =>{
        let errors_quantity = []
        let errors_product = []
        let token  = req.headers.token;
        try {
                let decoded = jwt.verify(token ,process.env.JWT_SECRET)
                if(decoded.role == "user") {
                let user = await User.findById(decoded.id)
                if(user.is_active){
                let items  = Array.isArray(req.body) ? req.body : [req.body]
                for(let item of items){
                        if (user.cart_items.has(item.productname)){
                                let currentquantity = user.cart_items.get(item.productname)
                                let checkedquantity = await stockCheck(item.productname , currentquantity + item.quantity)
                                if(typeof checkedquantity !== "string" ){
                                        user.cart_items.set(item.productname , currentquantity + item.quantity)
                                }
                                else if(checkedquantity == `${item.productname} not found`){
                                        errors_product.push(checkedquantity)
                                }
                                else {
                                        errors_quantity.push(checkedquantity)
                                }
                        }
                        else{
                                let checked = await stockCheck(item.productname , item.quantity)
                                if(typeof checked  !== "string"){
                                      user.cart_items.set(item.productname , item.quantity)
                                }
                                else if(checked == `${item.productname} not found`){
                                        errors_product.push(checked)
                                }
                                else {
                                        errors_quantity.push(checked)
                                }
                        }
                };
                await user.save();
                let cart_data = Object.fromEntries(user.cart_items)

                if (errors_product.length == 0 && errors_quantity.length == 0)
                        return res.status(200).json({message : "All items added successfully" , cart: cart_data })
                else if(errors_product.length == 0 && errors_quantity.length != 0){
                        return res.status(200).json({message : "Some items couldn't be added" , stock_unavailable : errors_quantity , cart:cart_data})
                }
                else if(errors_product.length != 0 && errors_quantity.length == 0){
                        return res.status(400).json({data : errors_product})
                }
                else{
                        return res.status(200).json({notfoundproducts : errors_product , fewquantity : errors_quantity , cart : cart_data})
                }
                }
                else{
                        return res.status(403).json({message :"User account is inactive"})
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


export const remove_items = async(req , res)=>{
        let errors_quantity = []
        let errors_product = []
        let token = req.headers.token;
        try {
                let decoded = jwt.verify(token , process.env.JWT_SECRET)
                if(decoded.role == "user"){
                        let user = await User.findById(decoded.id)
                        if(user.is_active){
                                let items = Array.isArray(req.body)? req.body : [req.body]
                                for(let item of items){
                                       let exists =  user.cart_items.has(item.productname)
                                       if(exists && item.quantity!== undefined){
                                        let existingquantity = user.cart_items.get(item.productname)
                                        if(item.quantity > existingquantity){
                                                errors_quantity.push(`There are only ${existingquantity} items of ${item.productname} in the cart`)
                                        }
                                        else{
                                                let newquantity = existingquantity - item.quantity
                                                if(newquantity == 0){
                                                        user.cart_items.delete(item.productname)
                                                }
                                                else
                                                        user.cart_items.set(item.productname , newquantity )
                                        }
                                       }
                                       else if(exists){
                                        user.cart_items.delete(item.productname)
                                       }
                                       else
                                        errors_product.push(`${item.productname} not found in cart`)
                                }
                                await user.save();
                                let cartdata = Object.fromEntries(user.cart_items)
                                if(errors_product.length == 0 && errors_quantity.length == 0 ){
                                        res.status(200).json({message:"items removed successfully" , data : cartdata})
                                }
                                else if(errors_product.length == 0 && errors_quantity.length != 0){
                                        res.status(200).json({message :" some items couldn't be removed" , error : errors_quantity , data : cartdata})
                                }
                                else if(errors_product.length != 0 && errors_quantity.length == 0){
                                        res.status(400).json({data : errors_product})
                                }
                                else{
                                        res.status(200).json({notfoundproducts : errors_product , quantityerrors :errors_quantity , data : cartdata})
                                }
                        }
                        else{
                                return res.status(403).json({message :"User account is inactive"})
                        }
                }
                else{
                        res.status(403).json({message : "You don't have the permission to remove items"})
                }
                

        }catch(err){
                res.status(401).json({message : "Invalid Token"})
        }
} 