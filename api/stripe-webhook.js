const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfutvrhuhaeremicicwp.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object;

  if (event.type === 'customer.subscription.created' || 
      event.type === 'customer.subscription.updated') {
    const customer = await stripe.customers.retrieve(subscription.customer);
    await supabase.from('users')
      .update({ 
        subscription_status: subscription.status,
        subscription_id: subscription.id,
        plan: subscription.items.data[0]?.price?.id
      })
      .eq('email', customer.email);
  }

  if (event.type === 'customer.subscription.deleted') {
    const customer = await stripe.customers.retrieve(subscription.customer);
    await supabase.from('users')
      .update({ subscription_status: 'canceled' })
      .eq('email', customer.email);
  }

  res.json({ received: true });
};