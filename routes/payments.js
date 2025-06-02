const express = require('express')
const Stripe = require('stripe')
const router = express.Router();
require('dotenv').config()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: { name: 'Advanced Security Plan' },
            unit_amount: 328, // $3.28 (must be in cents)
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/payment',
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});


module.exports = router