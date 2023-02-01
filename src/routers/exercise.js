const express = require('express')
const Exercise = require('../models/Exercise')
const List = require('../models/List')
const AnswerOption = require('../models/AnswerOption')
const auth = require('../middleware/auth')

const router = new express.Router()

/**
 * get lists exercises
 */
router.get('/lists/:listId/exercises', auth, async (req, res)=>{

    try{
        const exercises = await Exercise.find({list: req.params.listId})
            .populate('image')
            .populate('youtubeVideo')
            .populate('answerOptions')
            .sort({order: 1})

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

    const exercisesCount = await Exercise.find({list: req.body.list}).count()
    exercise.order = exercisesCount+1

    try{
        const newExercise = await exercise.save()
        if(!Object.keys(errors).length){

            req.body.answers.forEach(answer=>{
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

router.patch('/exercises/:id', auth, async(req, res)=>{
    try{
        const exercise = await Exercise.findOneAndUpdate({_id: req.params.id},{isArchived: req.body.isArchived})
        res.send(exercise)
    }catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/exercises/:id/order', auth, async(req, res)=>{
    try{
        const exercise = await Exercise.findOne({list: req.body.list, order: req.body.order})

        if(req.body.direction === 'down'){
            await Exercise.findOneAndUpdate({list: req.body.list, order: req.body.order +1},{order: req.body.order})
            exercise.order = req.body.order + 1
            await exercise.save()
        }else {
            if(exercise.order !== 1){
                await Exercise.findOneAndUpdate({list: req.body.list, order: req.body.order - 1},{order: req.body.order})
                exercise.order = req.body.order - 1
                await exercise.save()
            }
        }
        res.send(exercise)
    }catch (e) {
        res.status(500).send(e)
    }

})

// router.get('/exercises/update-order', async (req, res)=>{
//     try {
//         const lists = await List.find()
//
//         lists.forEach(async (list)=>{
//             let i = 0
//             const exercises = await Exercise.find({list: list._id})
//
//             exercises.forEach(async(exercise)=>{
//                 i = i + 1
//                 if(!exercise.order){
//                     console.log(exercise)
//                     exercise.order = i
//                     await exercise.save()
//                 }
//             })
//         })
//
//         res.send(lists)
//
//     }catch (e) {
//
//     }
// })

module.exports = router