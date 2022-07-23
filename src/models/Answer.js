const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    userAnswerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'Exrcise.answers' //TODO
    },
})

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer