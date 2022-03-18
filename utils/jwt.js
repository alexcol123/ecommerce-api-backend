const jwt = require('jsonwebtoken')


const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })

  return token
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)


// Attach cookies to response
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })

  // SHould match the .env JWT_LIFETIME,  example 1d  = 1 day
  const oneDay = 1000 * 60 * 60 * 24

  // Sends cookie
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  })

}

module.exports = {
  createJWT,
  isTokenValid,attachCookiesToResponse
}
