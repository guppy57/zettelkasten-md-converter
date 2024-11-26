import { readFile, writeFile, mkdir } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { OpenAIClient } from './openai-client.js';
import { ANALYSIS_PROMPT } from './prompts.js';

export class MarkdownProcessor {
  constructor(apiKey, outputDir = 'analysis-output') {
    this.openAIClient = new OpenAIClient(apiKey);
    this.outputDir = outputDir;
  }

  async processDirectory(directoryPath) {
    try {
      await this.ensureOutputDirectory();
      
      const files = await glob('**/*.md', { 
        cwd: directoryPath,
        absolute: true
      });

      if (files.length === 0) {
        console.log(`No markdown files found in ${directoryPath}`);
        return;
      }

      console.log(`Found ${files.length} markdown files`);
      
      for (const file of files) {
        await this.processFile(file);
      }
    } catch (error) {
      console.error('Error processing directory:', error);
      throw error;
    }
  }

  async ensureOutputDirectory() {
    try {
      await mkdir(this.outputDir, { recursive: true });
      console.log(`Output directory ensured: ${this.outputDir}`);
    } catch (error) {
      console.error('Error creating output directory:', error);
      throw error;
    }
  }

  async processFile(filePath) {
    try {
      console.log(`Processing: ${path.basename(filePath)}`);
      const content = await readFile(filePath, 'utf-8');
      await this.analyzeWithAI(content, filePath);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  async analyzeWithAI(content, filePath) {
    const prompt = ANALYSIS_PROMPT.replace('{content}', content);

    const response = await this.openAIClient.getCompletion(prompt, {
      temperature: 0.5,
      max_tokens: 1000
    });

    if (response) {
      await this.saveAnalysis(response, filePath);
      console.log(`Analysis completed for: ${path.basename(filePath)}`);
    }
  }

  async parseAndRemoveH1Heading(content) {
    const lines = content.split('\n');
    const firstLine = lines[0];
    const restOfLines = lines.slice(2).join('\n');
    const strippedTitle = firstLine.replace("# ", "");

    return { title: strippedTitle, content: restOfLines };
  }

  async saveAnalysis(analysis, originalFilePath) {
    const { title, content } = await this.parseAndRemoveH1Heading(analysis);
    const outputPath = path.join(this.outputDir, title);

    try {
      await writeFile(outputPath, content, 'utf-8');
      console.log(`Analysis saved to: ${outputPath}`);
    } catch (error) {
      console.error(`Error saving analysis for ${analysisFileName}:`, error);
    }
  }
}