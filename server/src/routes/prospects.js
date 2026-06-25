import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';
import { readData, writeData } from '../services/db.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const prospects = await readData('prospects');
    res.json(prospects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prospects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, role, company, notes, linkedinUrl } = req.body;
    
    // Extract ID from LinkedIn URL if not provided directly
    let id_linkedin = '';
    if (linkedinUrl) {
      const match = linkedinUrl.match(/in\/([^\/]+)/);
      if (match) id_linkedin = match[1];
    }
    
    const newProspect = {
      id: uuidv4(),
      name,
      role,
      company,
      notes: notes || '',
      linkedinUrl: linkedinUrl || '',
      id_linkedin,
      status: 'new', // new, contacted, replied
      createdAt: new Date().toISOString()
    };
    
    const prospects = await readData('prospects');
    prospects.unshift(newProspect);
    await writeData('prospects', prospects);
    
    res.json(newProspect);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prospect' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const prospects = await readData('prospects');
    const index = prospects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) return res.status(404).json({ error: 'Prospect not found' });
    
    if (status) prospects[index].status = status;
    if (notes !== undefined) prospects[index].notes = notes;
    
    await writeData('prospects', prospects);
    res.json(prospects[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prospect' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prospects = await readData('prospects');
    const filteredProspects = prospects.filter(p => p.id !== req.params.id);
    await writeData('prospects', filteredProspects);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prospect' });
  }
});

export default router;
