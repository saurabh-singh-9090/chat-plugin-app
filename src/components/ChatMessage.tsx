import { Message } from '../types';
import pluginManager from '../plugins/PluginManager';

interface ChatMessageProps {
  message: Message;
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { sender, content, type, pluginName, pluginData, timestamp } = message;
  const isUser = sender === 'user';
  
  // Determine additional class based on plugin type
  const getPluginClass = () => {
    if (type !== 'plugin' || !pluginName) return '';
    return `plugin-${pluginName}-message`;
  };
  
  const renderPluginContent = () => {
    if (type === 'plugin' && pluginName && pluginData) {
      const plugin = pluginManager.plugins.find(p => p.name === pluginName);
      if (plugin) {
        return plugin.renderResponse(pluginData);
      }
    }
    return <p>{content}</p>;
  };
  
  return (
    <div 
      className={`message ${isUser ? 'user-message' : 'assistant-message'} ${getPluginClass()}`}
      data-message-type={type}
    >
      {!isUser && <div className="message-sender">AI Assistant</div>}
      <div className="message-content">
        {type === 'text' ? <p>{content}</p> : renderPluginContent()}
      </div>
      <div className="message-timestamp">{formatTime(timestamp)}</div>
    </div>
  );
};

export default ChatMessage;
