import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true,
    }
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
