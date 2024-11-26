import OpenAI from 'openai';
import { DEFAULT_CONFIG } from './config.js';

export class OpenAIClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.client = new OpenAI({
      apiKey: apiKey
    });
  }

  async getCompletion(prompt) {
    try {
      const config = {
        ...DEFAULT_CONFIG,
        messages: [{ role: "user", content: prompt }]
      };

      const completion = await this.client.chat.completions.create(config);
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  }
}