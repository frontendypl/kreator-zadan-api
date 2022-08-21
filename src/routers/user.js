const express = require('express')
const validator = require('validator')
const auth = require('../middleware/auth')

const User = require('../models/User')

const router = new express.Router()

/** tylko dla admina, sprawdzać */
router.get('/users', async (req, res)=>{
    const users = await User.find()
    res.send(users)
})

router.post('/users', async (req, res)=>{
    const errors = {}

    const user = new User(req.body)
    const isUserAlreadyExists = await User.findOne({email: user.email})
    const passwordRepeatCorrectly = req.body.password === req.body.repeatPassword

    let shortCode = req.body.email.slice(0,2) +  Date.now().toString().slice(10)
    user.shortCode = shortCode
    let shortCodeDuplicate = await User.findOne({shortCode: user.shortCode})
    /**
     * Make longer shortcode if duplicated
     */
    if(shortCodeDuplicate){
        shortCode = req.body.email.slice(0,2) +  Date.now().toString().slice(9)
        user.shortCode = shortCode
        shortCodeDuplicate = await User.findOne({shortCode: user.shortCode})
    }

    if(isUserAlreadyExists){
        errors.email = {
            message: 'Konto o podanym adresie email już istnieje.'
        }
    }
    if(shortCodeDuplicate){
        errors.other = {
            message: 'Nieoczekiwany błąd. Spróbuj jeszcze raz'
        }
    }
    if(!passwordRepeatCorrectly) {
        errors.repeatPassword = {
            message: 'Hasła różnią się.'
        }
    }

    try{
        const token = await user.generateAuthToken()

        const newUser = await user.save()
        res.status(201).send({user: newUser,token})
    }catch (e) {

        e.errors = {
            ...e.errors,
            ...errors
        }

        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res)=>{

    const isValidEmail = validator.isEmail(req.body.email)
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch (e) {

        if(!isValidEmail){
            e.errors = {
                ...e.errors,
                email: {
                    message: 'Niepoprawny adres email.'
                }
            }
        }

        if(req.body.email === ''){
            e.errors = {
                ...e.errors,
                email: {
                    message: 'Uzupełnij email.'
                }
            }
        }
        if(req.body.password === ''){
            e.errors = {
                ...e.errors,
                password: {
                    message: 'Podaj hasło.'
                }
            }
        }
        if(req.body.email && req.body.password && isValidEmail){
            e.errors = {
                ...e.errors,
                other: {
                    message:  e.message
                }
            }
        }
        res.status(500).send(e)
    }
})

router.delete('/users',auth, async (req, res)=>{

    try{
        const user = await User.findByIdAndDelete(req.user._id)
        res.send('User removed')
    }catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router;