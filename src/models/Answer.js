const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    list: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    answerOption: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerOption',
        required: true
    },
},{
    timestamps: true
})

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer