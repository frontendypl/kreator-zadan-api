const express = require('express')
const validator = require('validator')
const nodemailer = require('nodemailer');

const auth = require('../middleware/auth')

const User = require('../models/User')

const router = new express.Router()

const transporter = nodemailer.createTransport({
    pool: true,
    host: "michal-kotula.atthost24.pl",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: "ucze.net@ucze.net",
        pass: "majkel00atthost",
    },
});

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

    let shortCode = 'U' + req.body.email.slice(0,2) +  Date.now().toString().slice(10)
    user.shortCode = shortCode
    let shortCodeDuplicate = await User.findOne({shortCode: user.shortCode})
    /**
     * try again if shortCode duplicated
     */
    if(shortCodeDuplicate){
        shortCode = 'U' + req.body.email.slice(0,2) +  Date.now().toString().slice(10)
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

        if(!Object.keys(errors).length){

            const mailOptions = {
                from: 'ucze.net@ucze.net',
                to: 'frontendypl@gmail.com',
                subject: `New user ${newUser.email}, ${newUser._id}`,
                html: `
                <div>
                    <h3>Ucze.net new user registered - ${newUser.email}, ${newUser._id}</h3>
                </div>
            `
            };
            //
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    // console.log(error);
                } else {
                    // console.log('Email sent: ' + info.response);
                }
            });

            res.status(201).send({user: newUser,token})
        }else{
            await newUser.remove()
            throw new Error('')
        }

    }catch (e) {

        e.errors = {
            ...e.errors,
            ...errors
        }

        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res)=>{
    const errors = {}

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