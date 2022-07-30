const express = require('express')
const validator = require('validator')
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
    const passwordRepeatCorrectly = req.body.password === req.body.repeatPassword

    try{
        if(isUserAlreadyExists) {
            throw new Error('Konto o podanym adresie email już istnieje.')
        }
        if(!passwordRepeatCorrectly) {
            throw new Error('Hasła różnią się.')
        }

        const token = await user.generateAuthToken()
        const newUser = await user.save()
        res.status(201).send({user: newUser,token})
    }catch (e) {
        if(isUserAlreadyExists) {
            e.errors = {
                ...e.errors,
                email: {
                    message: e.message
                }
            }
        }
        if(!isUserAlreadyExists && !passwordRepeatCorrectly) {
            e.errors = {
                ...e.errors,
                repeatPassword: {
                    message: e.message
                }
            }
        }

        // e.errors = {
        //     ...e.errors,
        //     other: {
        //         message: e.message
        //     }
        // }
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

router.post

module.exports = router;