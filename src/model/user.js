import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username : {
        required : true,
        type : String,
        unique : true,
    },
    password : {
        required : true,
        type : String,
    },
    chatToken : {
        required : true,
        type : Number,
        default : 10,
    },
    chats : [{
        type : Number,
        ref : 'Chat',
    }],
}, {
    timestamps : true,
})

const User = mongoose.model("users", userSchema)

export default User