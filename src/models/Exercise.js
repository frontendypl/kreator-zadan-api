const mongoose = require('mongoose')
const AnswerOption = require('./AnswerOption')

const exerciseSchema = new mongoose.Schema({
    isArchived: {
      type: Boolean,
      default: false
    },
    image: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: 'Image'
    },
    list:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Nazwij zadanie.']
    },
    content: {
        type: String,
        // required: [true, 'Wpisz treść zdania. Np "Co widzisz na obrazku?"'],
        trim: true
    },
    answerOptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerOption',
    }],
    contentFont: {
        type: String,
        default: null
    },
    answersFont: {
        type: String,
        default: null
    },

},{
    timestamps: true
})

exerciseSchema.post(['deleteMany', 'deleteOne', 'findOneAndDelete'],async exercise=>{

    try{
        await AnswerOption.deleteMany({exercise: exercise._id})
    }catch (e) {
        console.log(e)
    }

})

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise