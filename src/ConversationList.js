// ConversationList.js

import React from 'react';
import './ConversationList.css';

const ConversationList = ({ conversations, selectConversation, newConversation }) => {
  return (
    <div className="conversation-list">
      <button className="new-conversation-button" onClick={newConversation}>
        New Conversation
      </button>
      <ul>
        {conversations.map((conversation, index) => (
          <li key={index} onClick={() => selectConversation(conversation.id)}>
            <div className="conversation-item">
              <div className="conversation-title">Conversation {index + 1}</div>
              <div className="conversation-date">{new Date(conversation.date).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
