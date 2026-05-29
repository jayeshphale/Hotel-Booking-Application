import nodemailer from 'nodemailer'

let transporterPromise

const getTransporter = async () => {
  if (transporterPromise) return transporterPromise

  transporterPromise = (async () => {
    if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.ETHEREAL_USER,
          pass: process.env.ETHEREAL_PASS,
        },
      })
    }

    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  })()

  return transporterPromise
}

export const sendBookingConfirmationEmail = async (booking) => {
  const transporter = await getTransporter()
  const customer = booking.customer || {}
  const recipient = customer.email || booking.userId?.email

  const mailOptions = {
    from: '"Hotel Booking" <no-reply@hotelbooking.com>',
    to: recipient,
    subject: `Booking confirmed — ${booking.hotelId?.name || 'Your stay'}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
        <h2>Booking confirmed</h2>
        <p>Hi ${customer.firstName || booking.userId?.name || 'Guest'},</p>
        <p>Your reservation is confirmed for <strong>${booking.hotelId?.name}</strong>.</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</li>
          <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</li>
          <li><strong>Guests:</strong> ${booking.guests}</li>
          <li><strong>Total:</strong> ₹${booking.totalAmount}</li>
        </ul>
        <p>We will send your invoice shortly. If you have questions, reply to this email.</p>
        <p>Safe travels,</p>
        <p><strong>The Hotel Booking Team</strong></p>
      </div>
    `,
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}
