// pages/api/send-message-email.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { listing_id, buyer_email, seller_email, message } = req.body

  // Configure your SMTP transport (example: Gmail, Mailgun, etc.)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your email password or app password
    },
  })

  // Facebook-style HTML template
  const fbStyle = (content: string, cta?: string) => `
    <div style="font-family: Arial, sans-serif; background: #f0f2f5; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 24px;">
        <div style="font-size: 22px; font-weight: bold; color: #1877f2; margin-bottom: 12px;">Marketplace</div>
        <div style="margin-bottom: 18px; color: #222; font-size: 16px;">${content}</div>
        ${cta ? `<a href="mailto:${cta}" style="display: inline-block; background: #1877f2; color: #fff; font-weight: bold; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">Reply</a>` : ''}
      </div>
      <div style="text-align: center; color: #888; font-size: 12px; margin-top: 24px;">This is an automated message from Marketplace.</div>
    </div>
  `;

  // Email to seller
  await transporter.sendMail({
    from: 'Marketplace <noreply@yourdomain.com>',
    to: seller_email,
    subject: 'You have a new message on Marketplace',
    html: fbStyle(
      `You received a new message for your listing:<br><div style="background:#f0f2f5;border-radius:8px;padding:12px 16px;margin:12px 0;font-size:15px;border:1px solid #e4e6eb;">${message}</div><div style="margin-top:8px;">From: <b>${buyer_email}</b></div>`,
      buyer_email
    ),
  })

  // Confirmation to buyer
  await transporter.sendMail({
    from: 'Marketplace <noreply@yourdomain.com>',
    to: buyer_email,
    subject: 'Your message was sent',
    html: fbStyle(
      `Your message to the seller was received. They will reply soon.<br><div style="background:#f0f2f5;border-radius:8px;padding:12px 16px;margin:12px 0;font-size:15px;border:1px solid #e4e6eb;">${message}</div>`
    ),
  })

  res.status(200).json({ success: true })
}
