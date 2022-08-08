const express = require('express')
const Answer = require('../models/Answer')
const AnswerOption = require('../models/AnswerOption')

const router = new express.Router()

router.post('/answers', async (req, res)=>{

    const answer = new Answer(req.body)
    try{
        const {isCorrect} = await AnswerOption.findById(answer.answerOption)
        const newAnswer = await answer.save()

        res.status(201).send({isCorrect})
    }catch (e) {
        res.status(500).send(e)
    }

})

router.get('/lists/:id/answers', async (req, res)=>{
        try{

            const answers = await Answer
                .find({list: req.params.id})
                .populate('player')
                .populate('exercise')
                .populate('answerOption')
                .populate({
                    path: 'exercise',
                    populate: {
                        path: 'answerOptions'
                    }
                })
                .sort({'createdAt':-1})
            res.send(answers)
        }catch (e) {
            res.status(500).send(e)
        }
})

router.get('/players/:id/answers', async (req, res)=>{
    try{

        const answers = await Answer
            .find({player: req.params.id})
            .populate('answerOption')

        res.send(answers)
    }catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router