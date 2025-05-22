import React from 'react';
import { Plugin } from '../types';
import axios from 'axios';

interface DictionaryResult {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

class DictionaryPlugin implements Plugin {
  name = 'define';
  triggers = [/define (\w+)/i, /what does (\w+) mean/i, /meaning of (\w+)/i];

  async execute(input: string): Promise<DictionaryResult> {
    let word = '';
    
    if (input.startsWith('/define')) {
      word = input.substring(8).trim();
    } else {
      // Extract from natural language
      const match = input.match(/define (\w+)/i) || 
                   input.match(/what does (\w+) mean/i) ||
                   input.match(/meaning of (\w+)/i);
      word = match ? match[1] : '';
    }
    
    if (!word) {
      throw new Error('Please specify a word to define');
    }
    
    try {
      // Using Free Dictionary API
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = response.data[0];
      
      return {
        word: data.word,
        phonetic: data.phonetic,
        meanings: data.meanings.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.slice(0, 3).map((def: any) => ({
            definition: def.definition,
            example: def.example
          }))
        }))
      };
    } catch (error) {
      throw new Error(`Couldn't find definition for "${word}"`);
    }
  }

  renderResponse(data: DictionaryResult): JSX.Element {
    return (
      <div className="dictionary-card">
        <h3>{data.word} {data.phonetic && <span className="phonetic">{data.phonetic}</span>}</h3>
        <div className="meanings">
          {data.meanings.map((meaning, index) => (
            <div key={index} className="meaning">
              <p className="part-of-speech">{meaning.partOfSpeech}</p>
              <ol className="definitions">
                {meaning.definitions.map((def, i) => (
                  <li key={i}>
                    <p>{def.definition}</p>
                    {def.example && <p className="example">"{def.example}"</p>}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DictionaryPlugin;
