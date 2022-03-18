const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')

const { login, register, logout } = controller

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router
