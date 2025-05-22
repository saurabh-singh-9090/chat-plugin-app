export interface Message {
    id: string; // UUID
    sender: "user" | "assistant";
    content: string; // Raw text or markdown
    type: "text" | "plugin"; // Distinguish normal vs plugin messages
    pluginName?: string; // e.g. "weather", "calc", "define"
    pluginData?: any; // Plugin-specific data
    timestamp: string; // ISO timestamp
  }
  
  export interface Plugin {
    name: string;
    triggers: RegExp[];
    execute: (input: string) => Promise<any>;
    renderResponse: (data: any) => JSX.Element;
  }
  