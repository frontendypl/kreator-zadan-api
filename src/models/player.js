const mongoose = require('mongoose')
const {model} = require("mongoose");

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
        minLength: [1, 'Pole nie może być puste.']
        // required: true,
        // validate(value){
        //
        // }
    },

})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player