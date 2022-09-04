const mongoose = require('mongoose')
const Answer = require("./Answer");
const Exercise = require("./Exercise");
const Player = require("./Player");

const listSchema = new mongoose.Schema({
    isArchived: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'Podaj nazwe listy.'],
        minLength: 1,
        maxLength: [100, 'Maksymalnie 100 znaków.']
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
    },
}, {
    timestamps: true
})

listSchema.post(['deleteMany', 'deleteOne', 'findOneAndDelete'],async list=>{

    try{
        // await Answer.deleteMany({list: list._id})
        await Exercise.deleteMany({list: list._id})
        await Player.deleteMany({listId: list._id})

    }catch (e) {
        console.log({e})
    }

})

const List = mongoose.model('List',listSchema)

module.exports = List