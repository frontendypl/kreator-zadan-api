const express = require('express')
const Exercise = require('../models/Exercise')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/exercises', auth, async (req, res)=>{

    console.log(req.body)
    // res.send('ok')
    const exercise = new Exercise(req.body)
    exercise.owner = req.user._id
    // exercise.list = 'test error validation'

    try{
        const newExercise = await exercise.save()
        res.status(201).send(newExercise)
    }catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router