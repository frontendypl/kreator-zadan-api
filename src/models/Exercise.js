const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
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
        required: true,
        trim: true
    },
    answers: [{
        text: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }]
},{
    timestamps: true
})

const Image = new mongoose.model('Exercise', exerciseSchema)

module.exports = Image