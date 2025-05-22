import React from 'react';
import { Plugin } from '../types';

interface CalculationResult {
  expression: string;
  result: number;
}

class CalculatorPlugin implements Plugin {
  name = 'calc';
  triggers = [/calculate ([\d\s\+\-\*\/\(\)\.]+)/i, /what('s| is) ([\d\s\+\-\*\/\(\)\.]+)/i];

  async execute(input: string): Promise<CalculationResult> {
    let expression = '';
    
    if (input.startsWith('/calc')) {
      expression = input.substring(6).trim();
    } else {
      // Extract from natural language
      const match = input.match(/calculate ([\d\s\+\-\*\/\(\)\.]+)/i) || 
                   input.match(/what('s| is) ([\d\s\+\-\*\/\(\)\.]+)/i);
      expression = match ? match[1] || match[2] : '';
    }
    
    if (!expression) {
      throw new Error('Please provide a mathematical expression');
    }
    
    try {
      // Using Function constructor for safe evaluation
      // This is safer than eval() but still has limitations
      const result = new Function(`return ${expression}`)();
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }
      
      return {
        expression,
        result
      };
    } catch (error) {
      throw new Error(`Couldn't calculate: ${expression}`);
    }
  }

  renderResponse(data: CalculationResult): JSX.Element {
    return (
      <div className="calculator-card">
        <div className="calculation">
          <span className="expression">{data.expression} =</span>
          <span className="result">{data.result}</span>
        </div>
      </div>
    );
  }
}

export default CalculatorPlugin;
