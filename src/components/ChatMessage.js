import React from 'react';
import { ChevronRight } from 'lucide-react';

const ChatMessage = ({ message, isBot = true }) => {
  if (!message) return null;

  const formatAdmissionResponse = (text) => {
    const sections = text.split(/\d+\./).filter(Boolean);
    return sections.map((section, index) => {
      const title = section.split(':')[0].trim();
      const content = section.split(':')[1]?.trim();
      
      if (!content) return null;
      
      return (
        <div key={index} className="mb-6 animate-fadeIn">
          <h3 className="text-teal-700 dark:text-teal-400 font-semibold text-lg mb-2">
            {index + 1}. {title}
          </h3>
          <ul className="space-y-2 ml-6">
            {content.split('-').filter(Boolean).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 opacity-0 animate-fadeIn" 
                  style={{ animationDelay: `${idx * 100}ms` }}>
                <ChevronRight className="w-4 h-4 mt-1 text-teal-600" />
                <span className="text-gray-700 dark:text-gray-300">{item.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  const renderContent = () => {
    if (message.includes("How to Apply at Iqra University:")) {
      return (
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4">
            How to Apply at Iqra University
          </h2>
          {formatAdmissionResponse(message)}
        </div>
      );
    }
    
    return (
      <div className="prose dark:prose-invert">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'} max-w-3xl`}>
      <div className="typing-animation">
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatMessage;