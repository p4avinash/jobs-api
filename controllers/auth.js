const { BadRequestError, UnauthenticatedError } = require("../errors")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")

//function to handle the register functionality
const register = async (req, res) => {
  //code to create the user after salt creation in User Schema
  const user = await User.create({ ...req.body })
  //create token (code in User Schema)
  const token = user.createJwtToken()
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email: user.email }, token })
}

//function to handle login functionality
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  //check if user is present in the database
  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  //check if password is correct (code in User Schema)
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  //create token (code in User Schema)
  const token = user.createJwtToken()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
