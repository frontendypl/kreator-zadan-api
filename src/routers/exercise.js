const express = require('express')
const Exercise = require('../models/Exercise')
const AnswerOption = require('../models/AnswerOption')
const auth = require('../middleware/auth')

const router = new express.Router()

/**
 * get lists exercises
 */
router.get('/lists/:listId/exercises', auth, async (req, res)=>{

    try{
        console.log('tutaj', req.params.listId)
        const exercises = await Exercise.find({list: req.params.listId})
            .populate('image')
            .populate('answerOptions')

        res.send(exercises)
    }catch (e) {
        res.status(500).send(e)
    }

})

router.post('/exercises', auth, async (req, res)=>{

    const errors = {}
    const answerOptions = req.body.answers

    if(!answerOptions.length){
        errors.noAnswers = {
                message: 'Dodaj przynajmniej jedną odpowiedź'
            }

    }else{
        let isAnyCorrect = false
        let isAnyEmpty = false
        answerOptions.forEach(answer=>{
            if(answer.isCorrect){
                isAnyCorrect = true
            }
            if(!isAnyEmpty && answer.text === ''){
                isAnyEmpty = true
            }

        })
        if(!isAnyCorrect){
            errors.anyCorrect= {
                    message: 'Zaznacz prawidłową odpowiedź.'
                }
        }
        if(isAnyEmpty){
            errors.anyEmpty= {
                    message: 'Uzupełnij tekst w odpowiedziach.'
                }

        }
    }

    const exercise = new Exercise(req.body)

    try{
        const newExercise = await exercise.save()
        if(!Object.keys(errors).length){

            req.body.answers.forEach(answer=>{
                console.log({answer})
                answer.exercise = newExercise._id.toString()
            })

            const answerOptions = await AnswerOption.insertMany(req.body.answers)

            answerOptions.forEach(option=>{
                exercise.answerOptions.push(option._id)
            })

            await newExercise.save()

            res.status(201).send(newExercise)
        }else{
            await newExercise.remove()
            throw new Error('błędy w odpowiedziach')
        }

    }catch (e) {
        e.errors = {
            ...e.errors,
            ...errors
        }

        res.status(500).send(e)

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