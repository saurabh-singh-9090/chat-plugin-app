import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLoading ? 'Processing...' : 'Type a message or use /weather, /calc, /define...'}
        disabled={isLoading}
      />
      <button type="submit" disabled={!message.trim() || isLoading}>
        {isLoading ? 'Processing...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;
