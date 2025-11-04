import nodemailer from 'nodemailer'

type ContactBody = {
  fullName?: string
  email?: string
  phone?: string
  country?: string
  title?: string
  content?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as ContactBody

  if (!body?.email || !body?.fullName || !body?.content) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.SMTP_FROM || smtpUser || 'no-reply@example.com'
  const toEmail = process.env.CONTACT_TO || 'taok37c1@gmail.com'

  // If RESEND_API_KEY is present, send via Resend HTTP API (no SMTP needed)
  if (resendApiKey) {
    const subject = body.title?.trim() || 'New contact request'
    const html = `
      <h3>New contact from website</h3>
      <p><strong>Full Name:</strong> ${body.fullName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone || ''}</p>
      <p><strong>Country:</strong> ${body.country || ''}</p>
      <p><strong>Title:</strong> ${body.title || ''}</p>
      <p><strong>Content:</strong></p>
      <p>${(body.content || '').replace(/\n/g, '<br/>')}</p>
    `
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Motobike Tours <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: body.email,
        subject,
        html,
      }),
    })
    if (!resp.ok) {
      const text = await resp.text()
      throw createError({ statusCode: 500, statusMessage: `Resend error: ${text}` })
    }
    return { ok: true }
  }

  if (!smtpUser || !smtpPass) {
    // As a last resort in development, use Ethereal test account
    if (process.env.NODE_ENV !== 'production') {
      const test = await nodemailer.createTestAccount()
      const transport = nodemailer.createTransport({
        host: test.smtp.host,
        port: test.smtp.port,
        secure: test.smtp.secure,
        auth: { user: test.user, pass: test.pass },
      })
      const subject = body.title?.trim() || 'New contact request'
      const html = `
        <h3>New contact from website</h3>
        <p><strong>Full Name:</strong> ${body.fullName}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone || ''}</p>
        <p><strong>Country:</strong> ${body.country || ''}</p>
        <p><strong>Title:</strong> ${body.title || ''}</p>
        <p><strong>Content:</strong></p>
        <p>${(body.content || '').replace(/\n/g, '<br/>')}</p>
      `
      const info = await transport.sendMail({ from: 'Ethereal <no-reply@example.com>', to: toEmail, replyTo: body.email, subject, html })
      const previewUrl = nodemailer.getTestMessageUrl(info)
      return { ok: true, previewUrl }
    }
    throw createError({ statusCode: 500, statusMessage: 'SMTP credentials are missing. Set SMTP_USER and SMTP_PASS, or use RESEND_API_KEY.' })
  }

  const transporter = smtpHost
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })
    : nodemailer.createTransport({
        // Convenience for Gmail accounts when SMTP_HOST is not provided
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      })

  const subject = body.title?.trim() || 'New contact request'
  const html = `
    <h3>New contact from website</h3>
    <p><strong>Full Name:</strong> ${body.fullName}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Phone:</strong> ${body.phone || ''}</p>
    <p><strong>Country:</strong> ${body.country || ''}</p>
    <p><strong>Title:</strong> ${body.title || ''}</p>
    <p><strong>Content:</strong></p>
    <p>${(body.content || '').replace(/\n/g, '<br/>')}</p>
  `

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: body.email,
      subject,
      html,
    })
    return { ok: true }
  } catch (err: any) {
    // Provide a clearer error for common Gmail security issues
    const message = typeof err?.message === 'string' ? err.message : 'Failed to send email'
    console.error('Contact email error:', message)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})


