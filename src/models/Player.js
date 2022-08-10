const mongoose = require('mongoose')
const {model} = require("mongoose");
const bcrypt = require("bcryptjs");

const Answer = require('./Answer')

const playerSchema = new mongoose.Schema({
    /** list Id jest wymagan na początku, trzeba to bedzie poprawić pod realne id gdy taka kolekcja powstanie
     * trzeba bedzie to walidować, player wysle tylko jakis krótki kod/nazwe gdyż prawdziwe Id bedzie za długie
     * może by sie dało ustawić ilość znaków dla listId, to by ułatwiło zadanie.
     */
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'List'
    },
    name: {
        type: String,
        trim: true,
        maxLength: [30, 'Maksymalnie 30 znaków'],
        minLength: [1, 'Pole nie może być puste.'],
        required: [true, 'To pole nie może być puste'],
        // validate(value){
        //
        // }
    },
},{
    timestamps: true
})

// playerSchema.pre('findOneAndDelete', async function(next){
//     const player = this
//     await Answer.deleteMany({playerId: player._id})
//
//     next()
// })

playerSchema.post(['deleteMany', 'deleteOne', 'findOneAndDelete'],async player=>{

    try{
        await Answer.deleteMany({player: player._id})
    }catch (e) {
        console.log(e)
    }

})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player