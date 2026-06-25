import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';
import { readData, writeData } from '../services/db.js';
import { invokeLLM } from '../services/llm.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const posts = await readData('posts');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/generate', async (req, res) => {
  const { topic, tone } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  try {
    const systemPrompt = `Tu es un expert LinkedIn. Génère 3 variantes différentes de posts LinkedIn sur le sujet donné.
Ton: ${tone || 'Professionnel'}
Réponds UNIQUEMENT avec un objet JSON valide au format suivant :
{
  "variants": [
    { "content": "Contenu du post 1" },
    { "content": "Contenu du post 2" },
    { "content": "Contenu du post 3" }
  ]
}`;
    
    const responseText = await invokeLLM(systemPrompt, `Sujet : ${topic}`);
    
    // Attempt to parse JSON from response
    let parsedResponse;
    try {
      // Find JSON block if wrapped in markdown
      const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                        responseText.match(/(\{[\s\S]*\})/);
      
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      parsedResponse = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse LLM response:", responseText);
      return res.status(500).json({ error: 'Format de réponse invalide depuis l\'IA' });
    }

    const newPost = {
      id: uuidv4(),
      topic,
      tone,
      variants: parsedResponse.variants || [],
      createdAt: new Date().toISOString()
    };

    const posts = await readData('posts');
    posts.unshift(newPost);
    await writeData('posts', posts);

    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const posts = await readData('posts');
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    await writeData('posts', filteredPosts);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
