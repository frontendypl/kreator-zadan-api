const express = require('express')
const Image = require('../models/Image')
const auth = require('../middleware/auth')

const validator = require('validator')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

// const upload = multer({
//     limits: {
//         fileSize: 50000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb(new Error('Niedozwolony typ pliku.'))
//         }
//         cb(undefined, true) //accepted
//     }
// }).single('image')

const upload = multer()

const imageValidation = (img)=>{
    const errors = {}

    if(img.size > 5000000){
        errors.fileSize = {}
        errors.fileSize.message = "Ten plik jest zbyt duży, max 5mb"
    }
    if(!img.mimetype.match(/image/)){
        errors.fileFormat = {}
        errors.fileFormat.message = "Niedozwolony format pliku. Najlepiej użyć JPG lub PNG"
    }
    return Object.keys(errors).length ? errors: false;
}

router.post('/images', auth, upload.single('image'), async(req, res)=>{
//TODO 'sharp' - resize, minify images etc.
    if(!req.body.url && !req.file){
        return res.status(500).send({errors: {
                "fileInput": {
                    message: "Nie wybrałeś żadnego obrazu."
                },
                "urlInput": {
                    message: ""
                }
            }})
    }

    if(req.file){
        const validateImg = imageValidation(req.file)
        if(validateImg){
            return res.status(500).send({errors: validateImg})
        }
    }

    if (req.body.srcType === 'url' && !validator.isURL(req.body.url)) {
        return res.status(500).send({
            errors: {
                urlInput: {
                    message: 'Niepoprawny url obrazka'
                }
            }
        })
    }

    const image = new Image({
        srcType: req.body.srcType,
        owner: req.user._id,
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
        res.status(500).send({
            errors: {
                urlInput: {
                    unknown: 'Coś poszlo nie tak.'
                }
            }
        })
    }

})



router.get('/images/test', async (req, res)=>{

    const image = await Image.findById('62d01429ee6196df7af6a525')
    // res.send(image.src)
    if(image.srcType === 'buffer'){
        res.set('Content-Type', 'image/jpg')
        res.end(Buffer.from(image.src, 'binary'));
    }else{
        res.send(image.url)
    }
})

module.exports = router;