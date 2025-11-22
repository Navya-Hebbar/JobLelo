import React from 'react';

const ChatBubble = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg text-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;