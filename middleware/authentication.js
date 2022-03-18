const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
  try {
    //const payload = isTokenValid({ token })
    const { name, userId, role } = isTokenValid({ token })

    req.user = { name, userId, role }

    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
}

// const auhorizePermissions = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     throw new CustomError.UnauthorizedError('Unauthorized to access this route')
//   }

const auhorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unathorized to access this route'
      )
    }
    next()
  }
}

module.exports = { authenticateUser, auhorizePermissions }
