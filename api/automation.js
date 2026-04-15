const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
  'https://tfutvrhuhaeremicicwp.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  await resend.emails.send({
    from: 'SalonPro <hello@salonproai.com>',
    to, subject, html
  });
}

async function generateAIMessage(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}
async function sendSMS(to, message) {
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to
  });
}
module.exports = async (req, res) => {
  // Security check
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const fourWeeksAgo = new Date(today);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const fourWeeksAgoStr = fourWeeksAgo.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  let emailsSent = 0;

  // 1 — Thank you emails (24h after appointment)
  const { data: yesterdayBookings } = await supabase
    .from('bookings')
    .select('*, clients(*), services(*)')
    .eq('date', yesterdayStr)
    .eq('status', 'confirmed');

  for (const booking of yesterdayBookings || []) {
    if (!booking.clients?.email) continue;
    const message = await generateAIMessage(
      `Write a short, warm thank you email (subject line + body) for a salon client named ${booking.clients.name} who just had a ${booking.services?.name} service yesterday. Ask how they're enjoying it and invite them to book again. Be personal and friendly. Format: first line is subject, then blank line, then email body.`
    );
    const lines = message.split('\n');
    const subject = lines[0].replace('Subject:', '').trim();
    const body = lines.slice(2).join('\n');

    await sendEmail(booking.clients.email, subject || `Thank you ${booking.clients.name}! ✨`, `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0e0d;color:#e8ddd0;border-radius:16px;">
        <h2 style="color:#c9a84c;">Thank you for visiting! ✨</h2>
        <div style="line-height:1.8;white-space:pre-wrap;">${body}</div>
        <div style="margin-top:24px;text-align:center;">
          <a href="https://www.salonproai.com/?app=true" style="background:linear-gradient(135deg,#c9a84c,#e4c97e);color:#1a1410;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Book Again →</a>
        </div>
      </div>
    `);
    emailsSent++;
  }
// Also send SMS if client has phone
    if (booking.clients?.phone) {
      const smsMessage = await generateAIMessage(
        `Write a very short SMS (max 160 chars) thanking ${booking.clients.name} for their ${booking.services?.name} yesterday at the salon. Be warm and personal.`
      );
      await sendSMS(booking.clients.phone, smsMessage);
    }
  // 2 — Win-back emails (no visit in 4 weeks)
  const { data: lapsedClients } = await supabase
    .from('clients')
    .select('*')
    .lt('last_visit', fourWeeksAgoStr)
    .not('email', 'is', null);

  for (const client of lapsedClients || []) {
    const message = await generateAIMessage(
      `Write a short win-back email for salon client ${client.name} who hasn't visited in over 4 weeks. Be warm, not pushy. Offer a reason to come back. Notes about client: ${client.notes || 'none'}. Format: first line subject, blank line, then body.`
    );
    const lines = message.split('\n');
    const subject = lines[0].replace('Subject:', '').trim();
    const body = lines.slice(2).join('\n');

    await sendEmail(client.email, subject || `We miss you, ${client.name}! 💛`, `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0e0d;color:#e8ddd0;border-radius:16px;">
        <h2 style="color:#c9a84c;">We miss you! 💛</h2>
        <div style="line-height:1.8;white-space:pre-wrap;">${body}</div>
        <div style="margin-top:24px;text-align:center;">
          <a href="https://www.salonproai.com/?app=true" style="background:linear-gradient(135deg,#c9a84c,#e4c97e);color:#1a1410;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Book Now →</a>
        </div>
      </div>
    `);
    emailsSent++;
  }

  // 3 — Appointment reminders (24h before)
  const { data: tomorrowBookings } = await supabase
    .from('bookings')
    .select('*, clients(*), services(*)')
    .eq('date', tomorrowStr)
    .eq('status', 'confirmed');

  for (const booking of tomorrowBookings || []) {
    if (!booking.clients?.email) continue;
    await sendEmail(
      booking.clients.email,
      `Reminder: Your appointment tomorrow at ${booking.time} 📅`,
      `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0e0d;color:#e8ddd0;border-radius:16px;">
        <h2 style="color:#c9a84c;">Appointment Reminder 📅</h2>
        <p style="line-height:1.8;">Hi ${booking.clients.name},</p>
        <p style="line-height:1.8;">Just a friendly reminder that you have a <strong style="color:#c9a84c;">${booking.services?.name}</strong> appointment tomorrow at <strong style="color:#c9a84c;">${booking.time}</strong>.</p>
        <p style="line-height:1.8;">We look forward to seeing you! If you need to reschedule, please let us know as soon as possible.</p>
        <hr style="border:1px solid #2e2b28;margin:24px 0;">
        <p style="color:#7a7167;font-size:12px;text-align:center;">SalonPro · hello@salonproai.com</p>
      </div>
    `);
    emailsSent++;
  }

  res.json({ success: true, emailsSent });
};