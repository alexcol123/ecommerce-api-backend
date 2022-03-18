const User = require('../models/User.js')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

// Register  User
exports.register = async (req, res) => {
  const { email, password, name } = req.body

  const emailAlreadyExists = await User.findOne({ email })

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  // Note if you want Only  firs user to be an admin you can do the step bellow , otherwise u can do it manually in mongo atlas
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  // In order for us to  prevent user from asigning himself as a role: admin we are only sending the items he can edit bellow , exmple  name, emai, passsword   ( no  role)  view first line of register we did  not destructure  role.
  const user = await User.create({ name, email, password, role })

  // jwt
  //const tokenUser = { name: user.name, userId: user._id, role: user.role }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

// Logout User
exports.logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(StatusCodes.OK).json({ msg: 'user loged out!' })
}
