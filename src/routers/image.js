const express = require('express')
const Image = require('../models/Image')
const auth = require('../middleware/auth')

const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('file must be a image'))
        }
        cb(undefined, true) //accepted
    }
})

router.post('/images', auth, upload.single('image'), async(req, res)=>{
//TODO walidacja !!!!!!!!!!!!!!!!!!!
    const image = new Image({
        srcType: req.body.srcType,
        owner: req.user._id
    })
    if(req.body.srcType === 'buffer'){
        image.src = req.file.buffer
    }else{
        image.url = req.body.url
    }

    try{
        const newImage = await image.save()
        res.status(201).send(newImage)

    }catch (e) {
        res.status(500).send(e)
    }



})

router.get('/images/test', async (req, res)=>{

    const image = await Image.findById('62cf5fb8b924d9b4e788a732')
    // res.send(image.src)
    if(image.srcType === 'buffer'){
        res.set('Content-Type', 'image/jpg')
        res.end(Buffer.from(image.src, 'binary'));
    }else{
        res.send(image.url)
    }
})

module.exports = router;