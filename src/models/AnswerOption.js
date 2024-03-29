const mongoose = require('mongoose')

const answerOptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Uzupełnij tekst odpowiedzi.'],
    },
    isCorrect:{
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    }
},{
    timestamps: true
})

const AnswerOption = mongoose.model('AnswerOption', answerOptionSchema)

module.exports = AnswerOption