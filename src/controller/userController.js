import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import Chat from '../model/chat.js';

const JWT_SECRET = process.env.JWT_SECRET;

const getUser = async (req, res) => {
    try{
        const user = req.user;
        return res.status(200).json({ username: user.username, chatToken: user.chatToken })
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error'})
    }
}

const getUerChats = async (req, res) => {
    try{
        const user = req.user;
        const userchats = await User.aggregate([
            {$match : {username : user.username}},
            {$unwind : '$chats'},
            {$project : {chatId : '$chats'}},
            {$lookup : {
                from : "chats",
                localField: "chatId", // Field in the current pipeline to match on
              foreignField: "chatId", // Field in the Chat collection to join on
              as: "chatDetails" // Output array field for joined documents
            }},
            {$unwind : '$chatDetails'},
            {$project : {message : '$chatDetails.message', isBot : '$chatDetails.isBot', _id : 0}}
          ])
        return res.status(200).json({ chats: userchats, chatToken : user.chatToken })
    }catch (error) {
        console.error("Error fetching user chats:", error);
        return res.status(500).json({ message: 'Internal server error'})
    }
}

export { getUser, getUerChats }