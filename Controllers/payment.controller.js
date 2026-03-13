import Stripe from 'stripe';
import User from '../Models/user.model.js';
import Product from '../Models/product.model.js';
import { createOrder } from './order.controller.js';

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

export const checkout = async (req, res) => {
  const {  currency, paymentMethod } = req.body;
  let decoded = req.user;
  if(decoded.role != "user") {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  if (!currency || !paymentMethod) {
    return res.status(400).json({ error: 'Currency and payment method are required' });
  }

  const user = await User.findById(decoded.id).populate('cart_items.product');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const cartItems = user.cart_items;
  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let orderItems = [];

  for (const item of cartItems) {
    const product = item.product instanceof Product ? item.product : await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ error: `Product with id ${item.product} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for product ${product.name}` });
    }
  }

  let amount;
  try {
    amount = calculateStripeAmount(cartItems, currency);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const stripe = getStripe();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      payment_method: paymentMethod,
      payment_method_types:['card'],
      confirm: true,
    });

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

    await createOrder({
        userId: user._id,
        orderItems,
        payment_method: paymentIntent.payment_method_types[0],
        payment_status: paymentIntent.status,
        currency
    });

    user.cart_items = [];
    await user.save();


    res.status(200).json({
        success: true,
        message: "Payment successful",
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};