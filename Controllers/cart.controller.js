import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"
import Product from "../Models/product.model.js"
import catchAsyncError from "../Utils/catchAsyncError.js"
import AppErrors from "../Utils/appErrors.js"

const productExists = async (productId)=>{
        let productdata = await Product.findById(productId);
        if(!productdata){
        //        throw new AppErrors(`Product with ID ${productId} not found`, 404);
                  return `${productId} not found`;
        }
        else
                return productdata
}

const stockCheck = async (productId, productquantity) =>{
        let productinfo = await productExists(productId)
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
                let decoded = req.user
                if(decoded.role == "user") {
                let user = await User.findById(decoded.id)
                if(user.is_active){
                for(let item of req.body.cart_info){
                        let product = user.cart_items.find(element=> element.product.toString() === item.productId)
                        let finalquantity = item.quantity || 1
                        if (product){
                                let currentquantity = product.quantity
                                let checkedquantity = await stockCheck(item.productId , currentquantity + finalquantity)
                                if(typeof checkedquantity !== "string" ){
                                        product.quantity= currentquantity + finalquantity
                                }
                                else if(checkedquantity == `${item.productId} not found`){
                                        errors_product.push(checkedquantity)
                                }
                                else {
                                        errors_quantity.push(checkedquantity)
                                }
                        }
                        else{
                                let checked = await stockCheck(item.productId, finalquantity)
                                if(typeof checked  !== "string"){
                                      user.cart_items.push({
                                        product : item.productId,
                                        quantity : finalquantity
                                      })
                                }
                                else if(checked == `${item.productId} not found`){
                                        errors_product.push(checked)
                                }
                                else {
                                        errors_quantity.push(checked)
                                }
                        }
                };
                await user.save();
                if (errors_product.length == 0 && errors_quantity.length == 0)
                        return res.status(200).json({message : "All items added successfully" , cart: user.cart_items })
                else if(errors_product.length == 0 && errors_quantity.length != 0){
                        return res.status(200).json({message : "Some items couldn't be added" , stock_unavailable : errors_quantity , cart: user.cart_items})
                }
                else if(errors_product.length != 0 && errors_quantity.length == 0){
                        return res.status(400).json({data : errors_product})
                }
                else{
                        return res.status(200).json({notfoundproducts : errors_product , fewquantity : errors_quantity , cart :  user.cart_items})
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


export const remove_items = async(req , res)=>{
        let errors_quantity = []
        let errors_product = []
                let decoded = req.user
                if(decoded.role == "user"){
                        let user = await User.findById(decoded.id)
                        if(user.is_active){
                                for(let item of req.body.cart_info){
                                       let index =  user.cart_items.findIndex(element => element.product.toString() === item.productId)
                                       if(index === -1){
                                        errors_product.push(`${item.productId} not found in cart`)
                                        continue;
                                       }
                                       let cartItem = user.cart_items[index]
                                       if(item.quantity!== undefined){
                                        let existingquantity = cartItem.quantity
                                        if(item.quantity > existingquantity){
                                                errors_quantity.push(`There are only ${existingquantity} items of ${item.productId} in the cart`)
                                        }
                                        else{
                                                let newquantity = existingquantity - item.quantity
                                                if(newquantity == 0){
                                                        user.cart_items.splice(index , 1)
                                                }
                                                else
                                                        cartItem.quantity = newquantity
                                        }
                                       }
                                       else
                                        user.cart_items.splice(index , 1)
                                        
                                }
                                await user.save();
                                if(errors_product.length == 0 && errors_quantity.length == 0 ){
                                        res.status(200).json({message:"items removed successfully" , data : user.cart_items})
                                }
                                else if(errors_product.length == 0 && errors_quantity.length != 0){
                                        res.status(200).json({message :" some items couldn't be removed" , error : errors_quantity , data : user.cart_items})
                                }
                                else if(errors_product.length != 0 && errors_quantity.length == 0){
                                        res.status(400).json({data : errors_product})
                                }
                                else{
                                        res.status(200).json({notfoundproducts : errors_product , quantityerrors :errors_quantity , data : user.cart_items})
                                }
                        }
                        else{
                                return res.status(403).json({message :"User account is inactive"})
                        }
                }
                else{
                        res.status(403).json({message : "You don't have the permission to remove items"})
                }
}

export const checkout = async(req ,res)=>{
        let decoded = req.user
        let total = 0
        let order = []
        let user = await User.findById(decoded.id).populate("cart_items.product")
        if(!user.is_active){
                return res.status(403).json({message :"User account is inactive"})
        }
        if(user.cart_items.length === 0 ){
                return res.status(400).json({message : "Your cart is empty!"})
        }
        if(!req.body.paymentmethod){
                return res.status(400).json({message : "You must specify payment method"})
        }
        for(let item of user.cart_items){
                let valid = await stockCheck(item.product._id , item.quantity)
                if(typeof valid === "string"){
                        return res.status(400).json({message : "Can't proceed to checkout due to missing products in the stock"})
                }
                        total += item.product.price * item.quantity
                        item.product.stock -= item.quantity
                        await item.product.save()
                        order.push({
                                product : item.product.name,
                                totalprice : item.product.price * item.quantity
                        })
                
        }
        user.cart_items = []
        await user.save()
        return res.status(200).json({message : "Order placed successfully", order : {products : order , total_amount : total , PaymentMethod : req.body.paymentmethod}})

}





