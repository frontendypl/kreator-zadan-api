const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const resetPasswordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'User'
    },
    password: {
        type: String,
        required: [true, 'Uzupełnij hasło'],
        minLength: [5, 'Hasło musi mieć minimum 5 znaków']
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
},{
    timestamps: true
})

/**
 * todo: desc
 */
resetPasswordSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const ResetPassword = mongoose.model('ResetPassword', resetPasswordSchema)


module.exports = ResetPassword