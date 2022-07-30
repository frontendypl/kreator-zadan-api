const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: 'Image'
    },
    list:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: [true, 'Wpisz treść zdania. Np "Co widzisz na obrazku?"'],
        trim: true
    },
    answers: [{
        text: {
            type: String,
            required: [true, 'Uzupełnij tekst pytania.'],
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }]
},{
    timestamps: true
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise