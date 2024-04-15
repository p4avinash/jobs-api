const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

//get all the jobs based on the user id
const getAllJobs = async (req, res) => {
  const userId = req.user.userId
  const allJobs = await Job.find({ createdBy: userId }).sort("createdAt")
  res.status(StatusCodes.OK).json({ allJobs, count: allJobs.length })
}

//get single job based on id and user id
const getJob = async (req, res) => {
  //nested destructuring to get userId and jobId
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`)
  }

  res.status(StatusCodes.OK).json(job)
}

//create a new job
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

//update a job
const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty")
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

//delete a job
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`)
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: `Job successfully deleted with id: ${jobId}` })
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
