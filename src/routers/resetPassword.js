require('dotenv').config();
const express = require('express')
const validator = require('validator')
const nodemailer = require('nodemailer');

const ResetPassword = require('../models/ResetPassword')
const User = require('../models/User')

const router = new express.Router()

const transporter = nodemailer.createTransport({
    pool: true,
    host: "michal-kotula.atthost24.pl",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
    },
});

//(post) Tworzenie instancji modelu ResetPassword,
router.post('/reset-password', async (req, res)=>{

    const errors = {}

    try {

        if(!req.body.email) {
            errors.email = {
                message: 'Podaj email.'
            }
            throw new Error('')
        }

        const isValidEmail = validator.isEmail(req.body.email)
        if(!isValidEmail) {
            errors.email = {
                message: 'Nieprawidłowy adres email.'
            }
            throw new Error('')
        }

        const passwordRepeatCorrectly = req.body.password === req.body.repeatPassword
        if(!passwordRepeatCorrectly) {
            errors.repeatPassword = {
                message: 'Hasła różnią się.'
            }
            throw new Error('')
        }

        const user = await User.findOne({email: req.body.email})

        if(!user){
            errors.user = {
                message: 'Nie ma konta o podanym adresie email.'
            }
        }

        const resetPassword = new ResetPassword({
            user: user._id,
            password: req.body.password
        })
        await resetPassword.save()

        // TODO // zmienić w pozostałych instancjach active na false, bo moga zostać jakieś stare i aktywne !!!!

        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: user.email,
            subject: `Zmiana hasła:`,
            html: `
                <div>
                    <h2>Zmiana hasła do serwisu Ucze.net</h2>
                    <h3>
<!--                        <a href="http://localhost:8080/#/potwierdz-nowe-haslo/${resetPassword._id}">Kliknij ten link aby aktywować nowe hasło</a>-->
                        <a href="https://panel.ucze.net/#/potwierdz-nowe-haslo/${resetPassword._id}">Kliknij ten link aby aktywować nowe hasło</a>
                    </h3>
                    <h5>Jeśli nie zmieniałeś ostatnio hasła zignoruj tę wiadomość</h5>
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
        //TODO *

        return res.send({
            status: 'Aktywuj nowe hasło klikając link wysłany na podany email.'
        })

    }catch (e) {

        e.errors = {
            ...e.errors,
            ...errors
        }

        res.status(500).send(e)
    }



})

//(post)
//po kliknieciu w email przekierowanie na front, front wysyła tutaj 'post' z id ResetPassword, znajdujemy go, znajdujemy usera i updatujemy
//jego hasło.

router.post('/confirm-new-password', async (req, res)=>{

    const errors = {}

    try{
        //TODO sprawdzic typ czy req.body.resetPasswordId jest typu
        const resetPassword = await ResetPassword.findOne({
            _id: req.body.resetPasswordId,
            active: true
        })
        console.log({resetPassword})
        if(resetPassword){
            const user = await User.findByIdAndUpdate(resetPassword.user,{
                password: resetPassword.password,
                tokens: []
            })

            resetPassword.active = false
            await resetPassword.save()

            return res.send({
                status: 'Hasło zostało zmienione. Zaloguj się'
            })
        }else{
            throw new Error('')
        }

    }catch (e) {
        // errors.resetId = {
        //     message: 'Not found'
        // }
        // e.errors = {
        //     ...e.errors,
        //     ...errors
        // }

        return res.status(500).send({
            errors: {
                status: "Not found"
            }
        })
    }

})

// ** !!! Po zmianie hasła trzeba usunąć wszystkie tokeny.
// ** trzeba by tez obsłużyć na froncie takie wylogowanie, na innych zalogowanych urządzeniach, może wystarczy owświerzyć strone,
//ale jeszcze localstorage też może wyczyścic

module.exports = router