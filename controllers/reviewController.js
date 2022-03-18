const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

// Create a review
const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `Product with id: ${productId}  does not exist`
    )
  }

  const alreadySubmitedReview = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (alreadySubmitedReview) {
    throw new CustomError.BadRequestError(
      `Already submited a review for product : ${productId} `
    )
  }

  req.body.user = req.user.userId
  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}

//  Get all reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    // use populate to view informaiton on other models  example product  or user
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' })

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

// Get single review
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
    // use populate to view informaiton on other models  example product  or user
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' })

  if (!review) {
    throw new CustomError.NotFoundError(`No reviews with id ${reviewId} found `)
  }

  res.status(StatusCodes.OK).json({ review })
}

// update a review
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new CustomError.NotFoundError(`No reviews with id ${reviewId} found `)
  }

  checkPermissions(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()

  res.status(StatusCodes.OK).json({ review })
}

// Delete a review
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new CustomError.NotFoundError(`No reviews with id ${reviewId} found `)
  }

  checkPermissions(req.user, review.user)

  await review.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Review has been deleted.' })
}

// Get SingleProduct reviews
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
