import { MarkdownProcessor } from './src/markdown-processor.js';
import { ANALYSIS_PROMPT } from './src/prompts.js';

const REQUIRED_ENV_VARS = ['OPENAI_API_KEY'];

const OUTPUT_DIR = 'outputs';
const INPUT_DIR = 'inputs';

function validateEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}

async function main() {
  validateEnvironment();
  
  console.log('Markdown File Processor for Zettelkasten');
  console.log('----------------------------------\n');
  
  const processor = new MarkdownProcessor(process.env.OPENAI_API_KEY, OUTPUT_DIR, ANALYSIS_PROMPT);
  
  console.log('\nProcessing markdown files...\n');
  await processor.processDirectory(INPUT_DIR);
  
  console.log('\Processing complete! Check the output directory for analysis files.');
}

main().catch(console.error);