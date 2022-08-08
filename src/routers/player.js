const express = require('express');
const Player = require('../models/Player')
const auth = require("../middleware/auth");

const router = new express.Router()

/**
 * get players list
 */
router.get('/lists/:listId/players', auth, async (req, res)=>{

    try{
        const players = await Player
            .find({listId: req.params.listId})
            .sort({'createdAt':-1})

        res.send(players)
    }catch (e) {
        res.status(500).send(e)
    }

})

router.post('/players', async (req, res)=>{
    const player = new Player(req.body)
    // player.listId = req.body.listId
    try {
        const newPlayer = await player.save()
        res.status(201).send(newPlayer)
    }catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete('/players/:id', async(req, res)=>{

    try{
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id)
        console.log({deletedPlayer})
        res.send(deletedPlayer)
    }catch (e) {
        res.status(500).send(e)
    }

})



module.exports = router