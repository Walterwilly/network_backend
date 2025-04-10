import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const chatSchema = new mongoose.Schema({
    chatId : {
        type : Number,
        unique : true,
    },
    username : {
        required : true,
        type : String,
    },
    message : {
        type : String,
        default : null,
    },
    isBot : {
        required : true,
        type : Boolean,
    }
}, {
    timestamps : true,
})

chatSchema.plugin(AutoIncrement, { inc_field: 'chatId' });

const Chat = mongoose.model("chats", chatSchema)

export default Chat