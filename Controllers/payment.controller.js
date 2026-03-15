import Stripe from 'stripe';
import User from '../Models/user.model.js';
import Product from '../Models/product.model.js';
import { createOrder } from './order.controller.js';
import Voucher from '../Models/voucher.model.js';
import mongoose from 'mongoose';
import AppErrors from '../Utils/appErrors.js';

const getStripe= () => new Stripe(process.env.STRIPE_SECRET_KEY);

const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg',
  'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'
]);

const calculateStripeAmount = (cartItems, currency) => {
  const normalizedCurrency = currency.toLowerCase();
  const multiplier = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 1 : 100;

  const amount = cartItems.reduce((total, item) => {
    const quantity = Number(item.quantity);
    const product = item.product;

    if (!product || typeof product.price !== 'number' || Number.isNaN(product.price)) {
      throw new Error(`Cart item ${item._id} has an invalid price`);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Cart item ${item._id} has an invalid quantity`);
    }

    return total + Math.round(product.price * multiplier) * quantity;
  }, 0);

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Cart total must be a positive integer amount');
  }

  return amount;
};

export const getTestCards = (req, res) => {
  const testCards = [
    {
      accepted: true,
      "paymentMethod": "pm_card_visa"
    },
    {
      accepted: true,
      "paymentMethod": "pm_card_mastercard"
    },
    {
        accepted: false,
        "paymentMethod": "pm_card_visa_chargeDeclined"
    },
    {
        accepted: false,
        "paymentMethod": "pm_card_visa_chargeDeclinedInsufficientFunds"
    },
    {
        accepted: false,
        "paymentMethod": "pm_card_chargeDeclinedExpiredCard"
    },
  ];

  res.json(testCards);
};

export const checkout = async (req, res ,next) => {
  const {  currency, paymentMethod , voucher , wayToPay } = req.body;
  let decoded = req.user;
  
  if (!wayToPay) {
    return next(new AppErrors("Way to pay is required", 400));
  }

 if (!currency) {
    return next(new AppErrors("Currency is required", 400));
  }
  
  try{
    const user = await User.findById(decoded._id).populate("cart_items.product")
    if (!user) throw new AppErrors("User not found", 404);
    if (!user.is_active) throw new AppErrors("User account is inactive", 403);
    const cartItems = user.cart_items;
    if (cartItems.length === 0) throw new AppErrors("Cart is empty", 400);
    
  let amount;
  try {
    amount = calculateStripeAmount(cartItems, currency);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  let voucherDoc;
  if(voucher){
    voucherDoc = await Voucher.findOne({code : voucher})
    if (!voucherDoc) throw new AppErrors("Invalid voucher", 400);
    if (voucherDoc.applied_users.includes(user._id)) throw new AppErrors("Voucher already used", 400);
    if (new Date() > voucherDoc.expiration_date) throw new AppErrors("Voucher expired", 400);
    amount = Math.round(amount * (1 - voucherDoc.discount_percentage / 100));
}

  let order;
  let orderItems = [];
 
  for (const item of cartItems) {
    const product = item.product instanceof Product ? item.product : await Product.findById(item.product)
    if (!product) {
      throw new AppErrors( `Product with id ${item.product} not found` , 400);
    }
    if (product.stock < item.quantity) {
      throw new AppErrors(`Not enough stock for product ${product.name}`, 400);
    }
  }

    let paymentStatus = "pending";
    let paymentIntent;
    let paymentIntentId;

    if (wayToPay === "card"){
      if (!paymentMethod) {
         return next(new AppErrors("Payment method is required for card payments", 400));
    }

    const stripe = getStripe();

   try {
      paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      payment_method: paymentMethod,
      payment_method_types:['card'],
      confirm: true,
    });
    paymentStatus = paymentIntent.status;
    paymentIntentId = paymentIntent.id;

  }catch (stripeError){
    throw new AppErrors("Payment failed: " + stripeError.message, 400);
  }
} else if(wayToPay === "cash"){
  paymentStatus = "cash_on_delivery";
} else{
  return next(new AppErrors("Invalid wayToPay option. Must be 'card' or 'cash'", 400));
}
  for (const item of cartItems) {
        const product = item.product instanceof Product ? item.product : await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();

      orderItems.push({
        product_id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: item.quantity
      });
    }

       order = await createOrder({
        userId: user._id,
        orderItems,
        payment_method:  wayToPay === "card" ? paymentMethod : "Cash",
        payment_status: wayToPay === "card" ? paymentIntent.status : paymentStatus,
        currency
    });

        if(voucherDoc){
          voucherDoc.applied_users.push(user._id)
          await voucherDoc.save();
    }
    
    user.cart_items = [];
    await user.save();

    res.status(200).json({
        success: true,
        message: wayToPay === "card" ? "Payment successful" : "Order placed. Pay on delivery",
        paymentIntentId: wayToPay === "card" ?  paymentIntentId : undefined,
        amount,
        currency,
        status: paymentStatus,
        
        // orderId: order._id
    });


  } catch (error){
    next(error);
  }
};