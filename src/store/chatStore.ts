import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types';
import pluginManager from '../plugins/PluginManager';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, sender: "user" | "assistant", type?: "text" | "plugin", pluginName?: string, pluginData?: any) => void;
  processUserMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      
      addMessage: (content, sender, type = "text", pluginName, pluginData) => {
        const newMessage: Message = {
          id: uuidv4(),
          sender,
          content,
          type,
          pluginName,
          pluginData,
          timestamp: new Date().toISOString()
        };
        
        set(state => ({
          messages: [...state.messages, newMessage]
        }));
      },
      
      processUserMessage: async (content: string) => {
        // Add user message
        get().addMessage(content, "user");
        
        set({ isLoading: true });
        
        try {
          // Check if message is a command or should trigger a plugin
          const matchedPlugin = pluginManager.findMatchingPlugin(content);
          
          if (matchedPlugin) {
            const result = await matchedPlugin.execute(content);
            
            // Add plugin response
            get().addMessage(
              content, 
              "assistant", 
              "plugin", 
              matchedPlugin.name, 
              result
            );
          } else {
            // Regular message response
            get().addMessage(
              "I'm not sure how to help with that. Try using /weather [city], /calc [expression], or /define [word].", 
              "assistant"
            );
          }
        } catch (error: any) {
          get().addMessage(
            `Error: ${error.message || 'Something went wrong'}`, 
            "assistant"
          );
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'chat-storage',
    }
  )
);
