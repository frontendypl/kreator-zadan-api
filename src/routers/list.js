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

module.exports = router