const express = require('express')
const Answer = require('../models/Answer')

const router = new express.Router()

router.post('/answers', async (req, res)=>{

    const answer = new Answer(req.body)

    try{
        const newAnswer = await answer.save()
        res.status(201).send(newAnswer)
    }catch (e) {
        res.status(500).send(e)
    }

})

router.get('/lists/:id/answers', async (req, res)=>{
        try{
            const answers = await Answer.find({listId: req.params.id})

            //TODO tutaj potrzebuje zwracać:
            // playersName, exerciseImage, exerciseText, playerResponse, correctResponse itp
            // potrzeba to jakoś powiązać w modelu bo tutaj w pętlach to bez sensu !!!
            // później przenieść to też do innych modeli

            res.send(answers)
        }catch (e) {
            res.status(500).send()
        }
})

module.exports = router