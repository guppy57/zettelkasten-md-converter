import readlineSync from 'readline-sync';
import { OpenAIClient } from './openai-client.js';

export class CLI {
  constructor(apiKey) {
    this.openAIClient = new OpenAIClient(apiKey);
  }

  async start() {
    console.log('Welcome to the GPT-4 CLI Interface');
    console.log('Type "exit" to quit\n');

    while (true) {
      const userInput = readlineSync.question('Your prompt: ');
      
      if (userInput.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        break;
      }

      console.log('\nGetting response...');
      const response = await this.openAIClient.getCompletion(userInput);
      
      if (response) {
        console.log('\nGPT-4:', response, '\n');
      }
    }
  }
}