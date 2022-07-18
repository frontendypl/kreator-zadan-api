const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
        src: {
            type: String,
            trim: true
        },
        mimetype: {
            type: String
        },
        originalname: {
          type: String
        },
        url: {
            type: String,
            trim: true,
        },
        srcType: {
            type: String,
            required: true,
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