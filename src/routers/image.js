const express = require('express')
const Image = require('../models/Image')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/images', auth, async(req, res)=>{

})

module.exports = router;