const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
        src: {
            type: Buffer || String,
            required: true,
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
    },
    {
        timestamps: true
    }
)

const Image = mongoose.model('Image', imageSchema)
module.exports = Image;