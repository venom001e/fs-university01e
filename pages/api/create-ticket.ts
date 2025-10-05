import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { name, email, seat_no, subject, description } = req.body;

  if (!name || !email || !seat_no) {
    return res.status(400).json({ error: 'Name, email, and seat_no are required' });
  }

  const freshdeskDomain = process.env.FRESHDESK_DOMAIN;
  const apiKey = process.env.FRESHDESK_API_KEY;

  if (!freshdeskDomain || !apiKey) {
    return res.status(500).json({ error: 'Freshdesk configuration missing' });
  }

  const payload = {
    email,
    name,
    subject: subject || `Seat: ${seat_no} - ${name}`,
    description: `Name: ${name}\nSeat No: ${seat_no}\n\n${description || ''}`,
    priority: 1,
    status: 2,
    custom_fields: {
      cf_seat_number: seat_no,
    },
  };

  const auth = Buffer.from(`${apiKey}:X`).toString('base64');

  try {
    const response = await fetch(`https://${freshdeskDomain}/api/v2/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: errorData.message || 'Failed to create ticket' });
    }

    const data = await response.json();
    return res.status(200).json({ ticket_id: data.id });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
