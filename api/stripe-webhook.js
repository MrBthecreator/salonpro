const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfutvrhuhaeremicicwp.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

async function sendEmail(to, subject, html) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'SalonPro <hello@salonproai.com>',
    to, subject, html
  });
}

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object;

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const email = customer.email;
    const plan = subscription.items.data[0]?.price?.id;
    const planName = plan === process.env.PRICE_BASIC ? 'Basic' : plan === process.env.PRICE_PRO ? 'Pro' : 'Premium';
    const planPrice = plan === process.env.PRICE_BASIC ? '29' : plan === process.env.PRICE_PRO ? '59' : '99';

    await supabase.from('users').update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      plan: plan
    }).eq('email', email);

    if (event.type === 'customer.subscription.created') {
      await sendEmail(email, 'Payment confirmed — Welcome to SalonPro! 🎉', `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0f0e0d;color:#e8ddd0;padding:40px;border-radius:16px;">
          <h1 style="color:#c9a84c;text-align:center;">SalonPro</h1>
          <h2 style="color:#f5ede0;">Payment confirmed! 🎉</h2>
          <p style="line-height:1.7;">Thank you for subscribing to SalonPro <strong style="color:#c9a84c;">${planName} Plan</strong> at €${planPrice}/month.</p>
          <p style="line-height:1.7;">Your account is now fully active. You have access to all ${planName} features.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="https://www.salonproai.com/?app=true" style="background:linear-gradient(135deg,#c9a84c,#e4c97e);color:#1a1410;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Open SalonPro →</a>
          </div>
          <p style="color:#7a7167;font-size:13px;">You will be billed €${planPrice}/month. Cancel anytime from your account.</p>
          <hr style="border:1px solid #2e2b28;margin:24px 0;">
          <p style="color:#7a7167;font-size:12px;text-align:center;">SalonPro · hello@salonproai.com</p>
        </div>
      `);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customer = await stripe.customers.retrieve(subscription.customer);
    await supabase.from('users').update({ subscription_status: 'canceled' }).eq('email', customer.email);

    await sendEmail(customer.email, 'Your SalonPro subscription has b