import openai from "../config/openai.js";
import compute from "../computation/compute.js";
import Chat from "../model/chat.js";
import User from "../model/user.js";

const ask = async (req, res) => {
    //check the chat token
    const chatToken = req.user.chatToken;

    if(chatToken <= 0){
      return res.status(400).json({ message: 'Insufficient tokens for chatting' });
    }

    const { prompt } = req.body;
    try {
        //insert new chat
        const userChat = new Chat({
          username: req.user.username,
          message : prompt,
          isBot : false,
        });
        const savedChat = await userChat.save();

        //update chat attribute of user
        await User.findByIdAndUpdate(
          req.user._id, // Assuming req.user._id is available
          { $push: { chats: savedChat.chatId }}, // Push chatId
          { new: true }
        );


        const response = await openai.chat.completions.create({
          model: "ft:gpt-4o-mini-2024-07-18:personal:final-v1:ASgFS4A0:ckpt-step-465",
          messages: [{role: 'user', content: prompt}]
        });

    
        const jsonResponse = response.choices[0].message.content;
        const responseObject = JSON.parse(jsonResponse);

        const mode = responseObject.mode;
        const input = responseObject.input;
        const note = responseObject.note;

        const answer = await compute(mode, input, note);

        //insert bot chat
        const botChat = new Chat({
          username: "Bot",
          message: answer,
          isBot: true,
        });
        const savedBotChat = await botChat.save();

        //update chat attribute of user
        await User.findByIdAndUpdate(
          req.user._id, // Assuming req.user._id is available
          { $push: { chats: savedBotChat.chatId }, $inc: { chatToken: -1 }}, // Push botChat.chatId and decrement token
          { new: true }
        );
        
        return res.status(200).json({ message : answer , chatToken : chatToken-1 });
      } catch (error) {

        //insert bot chat error message
        const botChat = new Chat({
          username: "Bot",
          message: error.message,
          isBot: true,
        });
        const savedBotChat = await botChat.save();

        //update chat attribute of user
        await User.findByIdAndUpdate(
          req.user._id, // Assuming req.user._id is available
          { $push: { chats: savedBotChat.chatId }, $inc: { chatToken: -1 }}, // Push botChat.chatId and decrement token
          { new: true }
        );

        console.error(error);
        return res.status(200).json({ message: error.message });
      }
}

export default ask;