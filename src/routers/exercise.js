const express = require('express')
const Exercise = require('../models/Exercise')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/exercises', auth, async (req, res)=>{

    const exercise = new Exercise(req.body)
    exercise.owner = req.user._id

    // TODO sprawdzenie czy zaznaczono prawidłową odpowiedź !!!!!!
    console.log(req.body.answers)
    const isOneAnswerCorrect = req.body.answers.find(answer=>answer.isCorrect)

    try{
        const newExercise = await exercise.save()

        if (!isOneAnswerCorrect) {
            await newExercise.remove()
            return res.status(500).send({
                errors: {
                    isOneCorrect: {
                        message: 'Zaznacz poprawną odpowiedź.'
                    }
                }
            })
        }

        res.status(201).send(newExercise)
    }catch (e) {
        if (!isOneAnswerCorrect) {
            e.errors = {
                ...e.errors,
                isOneCorrect: {
                    message: 'Zaznacz poprawną odpowiedź. (pole obok prawidłowej odpowiedzi)'
                }}
        }
        res.status(500).send(e)
        console.log({e})
    }

})

router.delete('/exercises/:id', auth, async(req, res)=>{

    try{
        const exercise = await Exercise.findOneAndDelete({owner: req.user._id, _id: req.params.id})
        res.send(exercise)
    }catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router