const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Podaj nazwe listy.'],
        minLength: 1
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    shortCode: {
        type: String,
        required: true,
        immutable: true,
        unique: [true, 'Spróbuj ponownie.']
    }
}, {
    timestamps: true
})

const List = mongoose.model('List',listSchema)

module.exports = List