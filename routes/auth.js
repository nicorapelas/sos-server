const express = require('express')
const router = express.Router()
const path = require('path')
const twilio = require('twilio')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
var hbs = require('nodemailer-express-handlebars')
const devKeys = require('../config/devKeys')
const User = require('../models/User')
const EmailOtp = require('../models/EmailOtp')
const client = twilio(devKeys.twilioAccountSid, devKeys.twilioAuthToken)

router.post('/request-otp-sms', async (req, res) => {
  try {
    const { phoneNumber } = req.body
    const verification = await client.verify.v2
      .services(devKeys.twilioVerifySid)
      .verifications.create({ to: phoneNumber, channel: 'sms' })
    res.json({ message: 'OTP sent successfully', status: verification.status })
    console.log(`verification:`, verification)
    return
  } catch (error) {
    console.error(error)
    res.json({ error: 'Failed to json OTP' })
    return
  }
})

router.post('/verify-otp-sms', async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body
    const verification_check = await client.verify.v2
      .services(devKeys.twilioVerifySid)
      .verificationChecks.create({ to: phoneNumber, code: otpCode })
    if (verification_check.valid === false) {
      res.json({ error: 'Invalid OTP' })
      return
    }
    if (verification_check.valid === true) {
      // Check if user with this phone number exists
      const user = await User.findOne({ phoneNumber: phoneNumber })
      if (user) {
        const token = jwt.sign({ userId: user._id }, devKeys.JwtSecret)
        res.json({ token })
        return
      }
      // Create user here
      try {
        const newUser = new User({
          phoneNumber: phoneNumber,
          phoneNumberVerified: true,
          created: Date.now(),
        })
        await newUser.save()
        const token = jwt.sign({ userId: newUser._id }, devKeys.JwtSecret)
        res.json({ token })
        return
      } catch (error) {
        console.error(error)
        res.json({ error: `Can't create user` })
        return
      }
    } else {
      res.json({ error: 'Invalid OTP' })
      return
    }
  } catch (error) {
    console.error(error)
    res.json({ error: 'Failed to verify OTP' })
    return
  }
})

// Nodemailer Handlebars
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./templates/mailTemplates'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./templates/mailTemplates'),
  extName: '.handlebars',
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: devKeys.google.authenticateUser,
    pass: devKeys.google.authenticatePassword,
  },
})
transporter.use('compile', hbs(handlebarOptions))
// Register mailer options
mailManRegister = (email, otp, formattedOtp) => {
  const mailOptionsRegister = {
    from: 'nicorapelas@sos.com',
    to: email,
    subject: 'SOS - User authentication',
    template: 'emailOtpTemplate',
    context: {
      otp: formattedOtp,
    },
  }
  transporter.sendMail(mailOptionsRegister, async (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
      const emailOtp = new EmailOtp({
        email,
        otp,
      })
      await emailOtp.save()
    }
  })
}

router.post('/request-otp-email', async (req, res) => {
  const { email } = req.body
  const emailOtpCheck = await EmailOtp.findOne({
    email,
  })
  if (emailOtpCheck) {
    await EmailOtp.findByIdAndDelete({ _id: emailOtpCheck._id })
  }
  const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  const formattedOtp = otp
    .toString()
    .match(/.{1,2}/g)
    .join(' ')
  mailManRegister(email, otp.toString(), formattedOtp) // Make sure to pass the actual OTP value as a string
  res.json({ status: 'emailOtpSent' })
})

router.post('/verify-otp-email', async (req, res) => {
  const { email, otpCode } = req.body
  try {
    const emailOtpCheck = await EmailOtp.findOne({ email: email, otp: otpCode })
    if (!emailOtpCheck) {
      res.json({ error: 'OTP verification failed' })
      return
    } else {
      await EmailOtp.findByIdAndDelete({ _id: emailOtpCheck._id })
      // Check if user with this emailn address exists
      const user = await User.findOne({ emailAddress: email })
      if (user) {
        const token = jwt.sign({ userId: user._id }, devKeys.JwtSecret)
        res.json({ token })
        return
      }
      // Create user here
      const newUser = new User({
        emailAddress: email,
        emailAddressVerified: true,
        created: Date.now(),
      })
      await newUser.save()
      const token = jwt.sign({ userId: newUser._id }, devKeys.JwtSecret)
      res.json({ token })
      return
    }
  } catch (error) {
    console.error(error)
    res.json({ error: 'Failed to verify OTP' })
  }
})

module.exports = router
