const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
},{
    timestamps: true
})

const Image = new mongoose.model('Exercise', exerciseSchema)