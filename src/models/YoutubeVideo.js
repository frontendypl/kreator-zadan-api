const mongoose = require('mongoose')
const validator = require("validator");
// const youtubeUrl = require('youtube-url');

const youtubeVideoSchema = new mongoose.Schema({
        ytId: {
            type: String,
            trim: true,
            required: true
        },
        isFullLength: {
          type: Boolean,
          required: true
        },
        startTime: {
            type: Number,
        },
        endTime: {
            type: Number,
        },
        isArchived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const YoutubeVideo = mongoose.model('YoutubeVideo', youtubeVideoSchema)
module.exports = YoutubeVideo;