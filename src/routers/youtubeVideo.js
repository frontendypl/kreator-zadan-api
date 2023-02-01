const express = require('express')
const auth = require('../middleware/auth')

const YoutubeVideo = require('../models/YoutubeVideo')
const List = require("../models/List");

const router = new express.Router()

router.post('/youtube-videos', auth, async (req, res)=>{

    const ytId =  req.body.ytId;
    const startTime = req.body.startTime;
    const endTime =  req.body.endTime;
    const isFullLength = startTime !== 0 || endTime !== 0 ? false : true

    const errors = {}

    if(ytId === '' ) {
        errors.urlInput = {
            message: "Niepoprawny adres filmu."
        }
    }
    console.log({
        endTime, startTime,
    })
    if(endTime < startTime ) {
        errors.startTime = {
            message: "Start filmu nie może być ustawiony po zakończeniu"
        }
    }

    const video = {
        ytId,
        startTime,
        endTime,
        isFullLength
    }

    const youtubeVideo = new YoutubeVideo(video)

    try{
        const newVideo = await youtubeVideo.save()

        res.status(201).send(newVideo)
    }catch (e) {

        e.errors = {
            ...errors
        }

        res.status(500).send(e)
    }

})

router.delete('/youtube-videos/:id', auth, async(req,res)=>{

    try{
        const deletedYoutubeVideo = await YoutubeVideo.findByIdAndDelete(req.params.id)
        console.log({deletedYoutubeVideo})
        res.send(deletedYoutubeVideo)
    }catch (e) {
        res.status(500).send(e)
    }



})

module.exports = router