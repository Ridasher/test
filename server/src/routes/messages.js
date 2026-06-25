import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';
import { readData, writeData } from '../services/db.js';
import { invokeLLM } from '../services/llm.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const messages = await readData('messages');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/generate', async (req, res) => {
  const { recipientName, recipientRole, context, tone } = req.body;
  
  try {
    const systemPrompt = `Tu es un expert en networking sur LinkedIn. Rédige un message d'approche (outreach) pour la personne suivante.
Destinataire : ${recipientName} (${recipientRole || 'Non spécifié'})
Contexte de contact : ${context}
Ton : ${tone || 'Professionnel'}

Le message doit être concis, accrocheur et se terminer par un call-to-action (CTA). Ne renvoie QUE le contenu du message, sans fioritures ni guillemets.`;
    
    const responseText = await invokeLLM(systemPrompt, 'Génère le message de prospection.');
    
    res.json({ content: responseText.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { recipientName, recipientRole, context, content, status } = req.body;
    const newMessage = {
      id: uuidv4(),
      recipientName,
      recipientRole,
      context,
      content,
      status: status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const messages = await readData('messages');
    messages.unshift(newMessage);
    await writeData('messages', messages);
    
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message draft' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status, content } = req.body;
    const messages = await readData('messages');
    const index = messages.findIndex(m => m.id === req.params.id);
    
    if (index === -1) return res.status(404).json({ error: 'Message not found' });
    
    if (status) messages[index].status = status;
    if (content) messages[index].content = content;
    messages[index].updatedAt = new Date().toISOString();
    
    await writeData('messages', messages);
    res.json(messages[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const messages = await readData('messages');
    const filteredMessages = messages.filter(m => m.id !== req.params.id);
    await writeData('messages', filteredMessages);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
