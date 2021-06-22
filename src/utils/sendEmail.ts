import nodemailer from 'nodemailer'

// the current sendEmail function will default to the demo
// ethereal account
// when used in production, remove backup variables and
// set environmental variables for the following:

// EMAIL_HOST: email@email.com
// EMAIL_USER: email_username
// EMAIL_PASSWORD: for above
// EMAIL_FROM_MESSAGE: '"Demo Email Account" <demo@example.com>'

export async function sendEmail(to: string, html: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'alkzlpbn7oahpo6g@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'EVRMaYQrSEpuf7ayWk',
    },
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from:
      process.env.EMAIL_FROM_MESSAGE ||
      '"Demo Email Account" <demo@example.com>',
    to,
    subject: 'Change Password',
    html,
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  if (process.env.EMAIL_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
}
