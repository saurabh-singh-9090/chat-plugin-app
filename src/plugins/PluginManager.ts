import { Plugin } from '../types';
import WeatherPlugin from './WeatherPlugin';
import CalculatorPlugin from './CalculatorPlugin';
import DictionaryPlugin from './DictionaryPlugin';

class PluginManager {
  plugins: Plugin[] = [];

  constructor() {
    this.registerPlugin(new WeatherPlugin());
    this.registerPlugin(new CalculatorPlugin());
    this.registerPlugin(new DictionaryPlugin());
  }

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  findMatchingPlugin(message: string): Plugin | null {
    // Check for slash commands first
    if (message.startsWith('/')) {
      const command = message.split(' ')[0].substring(1);
      return this.plugins.find(plugin => plugin.name === command) || null;
    }
    
    // Then check for natural language triggers
    return this.plugins.find(plugin => 
      plugin.triggers.some(trigger => trigger.test(message))
    ) || null;
  }
}

export default new PluginManager();
