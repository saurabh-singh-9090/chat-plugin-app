import { useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useChatStore } from '../store/chatStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer: React.FC = () => {
  const { messages, isLoading, processUserMessage } = useChatStore();
  
  useEffect(() => {
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      processUserMessage('/help');
    }
  }, []);
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          <span className="header-icon">🧠</span> 
          AI Assistant
        </h2>
        <div className="header-subtitle">Ask me anything or try /weather, /calc, /define...</div>
      </div>
      
      <ScrollToBottom className="chat-messages" scrollViewClassName="messages-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </ScrollToBottom>
      
      <ChatInput onSendMessage={processUserMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatContainer;
