const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { to, subject, html, type } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'SalonPro <hello@salonproai.com>',
      to,
      subject,
      html,
    });

    if (error) return res.status(400).json({ error });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};