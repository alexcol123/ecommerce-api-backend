const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  auhorizePermissions,
} = require('../middleware/authentication')

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController')

router
  .route('/')
  .get(authenticateUser, auhorizePermissions('admin', 'owner'), getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)

router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUSerPassword').patch(authenticateUser, updateUserPassword)

// Since this is an id route  after the / we must place it last
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router
