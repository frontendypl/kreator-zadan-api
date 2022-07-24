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
    //TODO // 'userAnswerId' dla zadania 'exerciseId' powinno mieć isCorrect: true
    userAnswerId: { //czy nie powinno być playerAnswerId
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'Exrcise.answers' //TODO
    },
},{
    timestamps: true
})

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer