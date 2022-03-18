const mongoose = require('mongoose')

// Declare the Schema of the Mongo model
const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },

    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },

    comment: {
      type: String,
      required: [true, 'Please provide review text'],
      maxlength: [600, 'Description  can not be more 1000 characters'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRationg: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ])

  //console.log(result)
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRationg: Math.ceil(result[0]?.averageRationg || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
