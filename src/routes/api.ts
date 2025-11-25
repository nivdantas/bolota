import { Router } from 'express';
import { handleChatWebhook } from '../controllers/chatController.ts';

const router = Router();

router.post('/webhook', handleChatWebhook);

export default router;
