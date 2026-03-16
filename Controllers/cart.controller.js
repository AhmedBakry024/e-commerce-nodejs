import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"
import Product from "../Models/product.model.js"
import catchAsyncError from "../Utils/catchAsyncError.js"
import AppErrors from "../Utils/appErrors.js"
import { populate } from "dotenv"

const productExists = async (productId)=>{
        let productdata = await Product.findById(productId);
        if(!productdata){
                 throw new Error(new AppErrors(`Product with ID ${productId} not found`, 404));
        }
        else
                return productdata
}

const stockCheck = async (productId, productquantity) =>{
        let productinfo = await productExists(productId)
        if(productinfo.stock < productquantity)
                 throw new Error(new AppErrors(`Only ${productinfo.stock} items in the stock from ${productinfo.name}`, 401));
        else
                return productinfo
        
}

export const add_items = catchAsyncError(async(req,res,next) =>{
        let errors= []
                let decoded = req.user
                let user = await User.findById(decoded.id)

                if(!user.is_active)
                         return next(new AppErrors("User account is inactive", 403));

                for(let item of req.body.cart_info){
                         try {
                                let finalquantity = item.quantity || 1
                                let product = await stockCheck(item.productId, finalquantity)
                                const cartItem = user.cart_items.find(
                                        el => el.product.toString() === item.productId
                                )
                                if (cartItem){
                                       let newQuantity = cartItem.quantity + finalquantity
                                        await stockCheck(item.productId, newQuantity)
                                        cartItem.quantity = newQuantity

                                }
                                else{
                                        user.cart_items.push({
                                        product : item.productId,
                                        quantity : finalquantity
                                      })

                                }
                         }catch(err){
                                errors.push({
                                productId: item.productId,
                                message: err.message
                                })
                         }
                } 
                await user.save();

                if (errors.length > 0){
                        return res.status(200).json({
                                message : "Some items couldn't be added" , 
                                errors , 
                                cart: user.cart_items
                        })
                }
                 return res.status(200).json({
                        message : "All items added successfully" , 
                        cart: user.cart_items })
})

export const delete_item = catchAsyncError (async(req , res , next)=>{
                let decoded = req.user
                let target_id = req.params.id
                        let user = await User.findById(decoded.id)
                        if(!user.is_active)
                         return next(new AppErrors("User account is inactive", 403));

                                       let cartItem =  user.cart_items.find(element => element.product.toString() === target_id)
                                       if(!cartItem){
                                        throw new AppErrors(`Product with ID ${target_id} not found in cart`, 404)
                                       }
                                        const updatedUser = await User.findByIdAndUpdate(
                                                        decoded.id,
                                                        { $pull: { cart_items: { product: target_id } } },
                                                        { new: true })

                                res.status(200).json({
                                message: "Item removed successfully",
                                cart: updatedUser.cart_items
                                })
})


export const update_quantity = catchAsyncError (async(req , res , next)=>{
        let errors= []
                let decoded = req.user
                        let user = await User.findById(decoded.id)
                        if (!user.is_active) {
                           return next(new AppErrors("User account is inactive", 403));
                        }
                                for(let item of req.body.cart_info){
                                        try {
                                                if (item.quantity === undefined) {
                                                        throw new AppErrors("Please provide quantity", 400)
                                                }

                                       let cartItem  =  user.cart_items.find(element => element.product.toString() === item.productId)
                                       if(!cartItem)
                                        throw new AppErrors(`Product with ID ${item.productId} not found in cart`, 404)
                                        if (item.quantity === 0) {
                                                user.cart_items = user.cart_items.filter(el => el.product.toString() !== item.productId)
                                        }
                                        else{
                                                await stockCheck(item.productId, item.quantity)
                                                cartItem.quantity = item.quantity

                                        }
                                }catch(err){
                                         errors.push({
                                         productId: item.productId,
                                        message: err.message
                                        })
                                }
                        }
                                await user.save();
                                 if (errors.length > 0) {
                                        return res.status(200).json({
                                        message: "Some quantities could not be updated",
                                        errors,
                                        cart: user.cart_items
                                })
                        }
                                    res.status(200).json({
                                    message: "Cart quantities updated successfully",
                                    cart: user.cart_items
                                    })
})

export const viewCart = catchAsyncError (async(req , res ,next) =>{
        let decoded = req.user

        let user = await User.findById(decoded.id)
        .select(["cart_items.product","cart_items.quantity" , "-_id", "is_active" ])
        .populate("cart_items.product" 
        , { name: 1 , price: 1, description: 1 , _id: 0 ,stock:1 , image : 1})

        if(!user.is_active){
                return next(new AppErrors("User account is inactive", 403));
        }

        if(user.cart_items.length === 0 ){
                return res.status(200).json({
                message: "Your cart is empty",
                cart: []
        })
        }

        res.status(200).json(user.cart_items)
})

export const clearCart = catchAsyncError (async(req ,res ,next) =>{
        let decoded = req.user
        let user = await User.findById(decoded.id)

        if(!user.is_active){
                return next(new AppErrors("User account is inactive", 403));
        }
        if(user.cart_items.length === 0 ){
                return res.status(200).json({
                message: "Your cart is empty",
                cart: []
        })
        }
        user.cart_items = []
        await user.save()
        res.status(200).json({message : "Cart cleared successfully" , data : user.cart_items})
})

// export const checkout = catchAsyncError (async(req ,res)=>{
//         let decoded = req.user
//         let total = 0
//         let order = []
//         let user = await User.findById(decoded.id).populate("cart_items.product")
//         if(!user.is_active){
//                 return res.status(403).json({message :"User account is inactive"})
//         }
//         if(user.cart_items.length === 0 ){
//                 return res.status(200).json({message : "Your cart is empty!"})
//         }
//         if(!req.body.paymentmethod){
//                 return res.status(400).json({message : "You must specify payment method"})
//         }
//         for(let item of user.cart_items){
//                 let valid = await stockCheck(item.product._id , item.quantity)
//                 if(typeof valid === "string"){
//                         return res.status(400).json({message : "Can't proceed to checkout due to missing products in the stock"})
//                 }
//                         total += item.product.price * item.quantity
//                         item.product.stock -= item.quantity
//                         await item.product.save()
//                         order.push({
//                                 product : item.product.name,
//                                 totalprice : item.product.price * item.quantity
//                         })
//         }
//         user.cart_items = []
//         await user.save()
//         return res.status(200).json({message : "Order placed successfully", order : {products : order , total_amount : total , PaymentMethod : req.body.paymentmethod}})
// })