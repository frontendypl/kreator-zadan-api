const express = require('express')
const List = require('../models/list')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/lists', auth, async(req, res)=>{

    const list = new List({
        ...req.body,
        owner: req.user._id
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

router.delete('/lists/:id', auth, async (req,res)=>{
    const id = req.params.id

    const list = await List.findOne({_id: id, owner: req.user._id})
    await list.remove()
    res.send(list)
})

module.exports = router