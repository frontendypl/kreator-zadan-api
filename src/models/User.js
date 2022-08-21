const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const List = require('./List')
const Image = require('./Image')

/**
 * todo: desc
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, 'Uzupełnij email'],
        immutable: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Podaj poprawny adres email.')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Uzupełnij hasło'],
        minLength: [5, 'Hasło musi mieć minimum 5 znaków']
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        length: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

/**
 * metody definiujemy dla instancji obiektu, czyli np gdy już znajdziemy konkretnego usera: user.generateAuthToken()
 */
userSchema.methods.generateAuthToken = async function(){
    const user = this
    /** todo: secreta też do .env mozna by przenieść */
    const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET_KEY)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}

/**
 * todo: desc
 */
userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

/**
 * todo: desc
 */
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

/**
 * todo: desc
 * @param email
 * @param password
 */

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Nie ma takiego użytkownika.')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Niepoprawne hasło')
    }
    return user

}

userSchema.post(['deleteMany', 'deleteOne', 'findOneAndDelete'], async user=>{

    try{
        await List.deleteMany({owner: user._id})
        await Image.deleteMany({owner: user._id})
    }catch (e) {
        console.log(e)
    }

})

const User = mongoose.model('User', userSchema)

module.exports = User