const express = require('express')
const User = require('../models/User')

const router = new express.Router()

/** tylko dla admina, sprawdzać */
router.get('/users', async (req, res)=>{
    const users = await User.find()
    res.send(users)
})

router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    const isUserAlreadyExists = await User.findOne({email: user.email})
    console.log({isUserAlreadyExists})
    if(isUserAlreadyExists) return res.status(409).send({
        errors: {
            "email": {
                message: "Konto już istnieje. Zaloguj się."
            }
        }
    })

    try{
        const token = await user.generateAuthToken()
        const newUser = await user.save()
        res.status(201).send({user: newUser,token})
    }catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch (e) {
        res.status(404).send({
            errors: {
                "email": {
                    message: "Niepoprawne hasło."
                }
            }
        })
    }
})

router.post

module.exports = router;