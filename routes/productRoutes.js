const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  auhorizePermissions,
} = require('../middleware/authentication')

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage, 
} = require('../controllers/ProductController')


const { getSingleProductReviews} = require('../controllers/reviewController')

router
  .route('/')
  .post([authenticateUser, auhorizePermissions('admin')], createProduct)
  .get(getAllProducts)

// Image Upload. Image must be on top of routes with ID , or the system will thing the /uploadImage is the ID
router
  .route('/uploadImage')
  .post([authenticateUser, auhorizePermissions('admin')], uploadImage)

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, auhorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, auhorizePermissions('admin')], deleteProduct)


  router
  .route('/:id/reviews')
  .get(getSingleProductReviews)


module.exports = router
