const express = require('express')
const List = require('../models/List')
const auth = require('../middleware/auth')

const Player = require('../models/Player')
const Exercise = require('../models/Exercise')

const router = new express.Router()

router.post('/lists', auth, async(req, res)=>{

    let shortCode = req.body.name[0] +  Date.now().toString().slice(10)

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
router.get('/lists/validation/:shortCode', async (req, res)=>{

    try{
        const list = await List.findOne({shortCode: req.params.shortCode})
        if(list){
            res.send(list)
        }else{
            res.status(404).send({error: 'Niepoprawny kod'})
        }
    }catch (e) {
        res.status(500).send()
    }

})

/**
 * get lists player
 */
router.get('/lists/:listId/players', auth, async (req, res)=>{

    try{
        const players = await Player.find({listId: req.params.listId})
        res.send(players)
    }catch (e) {
        res.status(500).send(e)
    }

})

/**
 * get lists exercises
 */
router.get('/lists/:listId/exercises', auth, async (req, res)=>{

    try{
        const exercises = await Exercise.find({listId: req.params.list}) //TODO
        res.send(exercises)
    }catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/lists/:id', auth, async (req,res)=>{
    const id = req.params.id

    const list = await List.findOne({_id: id, owner: req.user._id})

    if(list){
        await list.remove()
        res.send(list)
    }else{
        res.status(404).send()
    }

})

router.patch('/lists/:id', auth, async (req, res)=>{
    const id = req.params.id
    const updates = Object.keys(req.body)
    const list = await List.findOne({_id: id, owner: req.user._id})
    if(list){
        updates.forEach(key=>list[key] = req.body[key])
        await list.save()
        res.send(list)
    }else{
        res.status(404).send()
    }
})

module.exports = router