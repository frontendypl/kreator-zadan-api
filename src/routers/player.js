const express = require('express');
const Player = require('../models/Player')

const router = new express.Router()

// router.get('/exercise', (req, res)=>{
//     res.send({
//         id: 'sdv45345',
//         img: '',
//         imgLink: 'https://images.pexels.com/photos/1819656/pexels-photo-1819656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//         question: 'Jaką nazwe nosi to zjawisko?',
//         answers: [{id:1,text: 'Tęcza'},{id:2,text: 'Szron'},{id:3,text: 'Zorza polarna'},]
//     })
// })

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