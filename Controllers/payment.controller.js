import { stat } from 'fs';
import Stripe from 'stripe';

const getStripe= () => new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const createPaymentIntent = async (req, res) => {
  const { amount, currency, paymentMethod } = req.body;

  const stripe = getStripe();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      payment_method: paymentMethod,
      payment_method_types:['card'],
      confirm: true,
    });


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