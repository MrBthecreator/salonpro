const stripe = require('stripe')('sk_test_51TMAIi05DLhFoiceXXvXf21xHDnhA8Ft4s13e6IBDF75leh1BMnWhO7QrMOH43dZV7slm6BdSxs38A4sGLBVVU7e000FNKLUX3');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { priceId, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: 'https://salonpro-pink.vercel.app/?success=true',
    cancel_url: 'https://salonpro-pink.vercel.app/?cancelled=true',
  });

  res.json({ url: session.url });
};