const express = require('express')

const auth = require('../middleware/auth')

const User = require('../models/User')
const List = require('../models/List')
const Image = require('../models/Image')
const Player = require('../models/Player')
const Exercise = require('../models/Exercise')
const Answer = require('../models/Answer')

const router = new express.Router()

router.post('/lists', auth, async(req, res)=>{

    let shortCode = 'L' + req.body.name[0] + Date.now().toString().slice(10)

    const list = new List({
        ...req.body,
        owner: req.user._id,
        shortCode
    })

    try{
        const newList = await list.save()
        res.status(201).send(newList)
    }catch (e) {
        res.status(400).send(e)
    }

})

router.get('/lists', auth, async (req, res)=>{
    try{
        const lists = await List.find({owner: req.user._id})
        res.send(lists)
    }catch (e) {
        res.status(400).send()
    }
})

/**
 * shortCode validation
 */
router.post('/lists/validation', async (req, res)=>{
    let list = null
    let user = null
    let userLists = null
    try{
        const shortCodeType = req.body.shortCode.slice(0,1)
        if(shortCodeType === 'L'){
            list = await List.findOne({shortCode: req.body.shortCode}).populate('owner', 'shortCode')
        }else if(shortCodeType === 'U'){
            user = await User.findOne({shortCode: req.body.shortCode})
            if(user){
                userLists = await List.find({owner: user._id.toString()})
                console.log({userLists})
            }
        }

        if(list){
            res.send({list})
        }else if(user){
            res.send({userLists})
        }
        else{
            res.status(404).send({errors: {
                    "shortCodeInput": {
                        message: "Niepoprawny kod"
                    }
                }})
        }
    }catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/lists/:id', auth, async (req,res)=>{

    try{
        const deletedList = await List.findByIdAndDelete(req.params.id)
        console.log({deletedList})
        res.send(deletedList)
    }catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/lists/:id', auth, async (req, res)=>{
    const id = req.params.id
    const updates = Object.keys(req.body)

    try{
        const list = await List.findOne({_id: id, owner: req.user._id})
        if(list){
            updates.forEach(key=>list[key] = req.body[key])
            await list.save()
            res.send(list)
        }else{
            res.status(404).send()
        }
    }catch (e) {
        res.status(500).send(e)
    }

})

/**
 * TODO przenieść do routers/exercise.js
 * return current exercises for user,
 * filter solved ones
 */
router.get('/lists/:listId/:playerId/exercises', async (req, res)=>{
    //TODO sprobować stworzyć w modelu wirtualną property isCorrect i pobierac tylko poprawne

    try{
        let exercises = await Exercise.find({list: req.params.listId, isArchived: false})
            .populate('answerOptions')
            .sort({order: 1})

        console.log({exercises})

        const answers = await Answer.find({player: req.params.playerId})
            .populate('answerOption')
        let completed= false;

        answers.forEach(answer=>{
            if(!answer.answerOption.isCorrect) return
            exercises = exercises.filter(exercise=>{
                return (exercise._id.toString() !== answer.exercise.toString())
            })
        })

        if(!exercises.length){
            // exercises = await Exercise.find({list: req.params.listId})
            completed = true
            return res.send({completed})
        }

        // console.log('tutaj', exercises[0].image?.toString())
        const imageObject = exercises[0].image && exercises[0].image.toString() ? await Image.findById(exercises[0].image) : null

        res.send({completed, content: exercises[0], imageObject: imageObject})
    }catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

// /** //TODO raczej dla wszystkie answersy dla listy
//  * return all users answers
//  * toDo // dodatkowo w parametrach opcja filtracji, sortowania itp
//  */
// router.get('/lists/:listId/:playerId/answers', async (req, res)=>{
//     try{
//         const answers = await Answer.find({
//             playerId: req.params.listId
//         })
//         res.send(answers)
//     }catch (e) {
//         res.status(500).send(e)
//     }
// })

module.exports = router