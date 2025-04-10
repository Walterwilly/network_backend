import express from "express";
import authMiddleware from "../authMiddleware.js";
import { sayHello } from "../controller/helloController.js";
import { getUser , getUerChats} from "../controller/userController.js"
import ask from "../controller/chat.js";
const router = express.Router()

router.get('/hello', authMiddleware, sayHello)
router.get('/user', authMiddleware, getUser)
router.get('/chats', authMiddleware, getUerChats)
router.post('/ask', authMiddleware, ask)

export default router;