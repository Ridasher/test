export const invokeLLM = async (systemPrompt, userPrompt) => {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3';

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Ollama API Error:', err);
      throw new Error('Erreur lors de la communication avec Ollama');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error invoking LLM:', error);
    throw new Error('Échec de la génération IA. Vérifiez que Ollama est démarré.');
  }
};
