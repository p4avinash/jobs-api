require("dotenv").config()
require("express-async-errors")
const express = require("express")
const app = express()

//import connectDB
const connectDB = require("./db/connect")
const authenticateUser = require("./middleware/authentication")

//import routes
const authRouter = require("./routes/auth")
const jobRouter = require("./routes/jobs")

//import error handler
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

//middleware to parse data coming in request
app.use(express.json())

//routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobRouter)

//middlewares to handle errors
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

//function to connect with database and start the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
