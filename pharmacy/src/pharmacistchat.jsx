import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import PharmacistNavbar from './PharmacistNavBar';
import PharmacistFooter from './PharmacistFooter';

const MyChat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const messagesContainerRef = useRef(null);

  const generateUserId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const storedToken = localStorage.getItem('pharmacistToken');
  const token = storedToken ? jwtDecode(storedToken) : null;
  const userId = token ? token.username : generateUserId();

  const socket = useRef(null);
  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
}, [messages]);

  useEffect(() => {
    setUsername(userId);
     socket.current = io('http://localhost:3005', {
      query: {
        userId: userId,
        roomId: roomId,
      },
    });
    appendMessage('Patient joined', true);
    appendMessage('You joined', true);
    console.log('Before calling acceptChat'); // Add this line
    acceptChat({ user: userId, userId, roomId });
    console.log('After calling acceptChat'); // Add this line
  

    socket.current.on('chat-message', (data) => {
      if (userId !== data.userId && roomId === data.roomId) {
        appendMessage(`${data.name}: ${data.message}`);
      }
    });

    socket.current.on('user-disconnected', (data) => {
      if (roomId === data.roomId) {
        appendMessage(`${data.name} disconnected`);
      }
    });

    localStorage.setItem('userId', userId);
    localStorage.setItem('roomId', roomId);

    return () => {
      socket.current.disconnect();
    };
  }, []); // Include userId and roomId in the dependency array

  const acceptChat = ({ user, userId, roomId }) => {
    console.log('Before socket.emit');
  
    socket.current.emit('accept-chat', { user, userId, roomId }, (acknowledgment) => {
        if (acknowledgment.success) {
          console.log('Chat accepted');
        } else {
          console.error('Failed to accept chat:', acknowledgment.error);
        }
      });
      
  };
  
  

  const sendMessage = (e) => {
    e.preventDefault();
    const message = messageInput;
    appendMessage(`You: ${message}`, true);
    socket.current.emit('send-chat-message', { message, userId, roomId });
    setMessageInput('');
  };

  const appendMessage = (message, isYourMessage) => {
    setMessages((prevMessages) => [...prevMessages, { content: message, isYourMessage }]);
  };

  return (
    <div>
      <PharmacistNavbar />
      <div className="container mt-4" style={{ width: '600px' }}>
        <div
          ref={messagesContainerRef}
          className="border p-3 mb-3"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded ${
                message.isYourMessage ? 'bg-success text-white' : 'bg-info text-white'
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <div className="input-group mb-3">
            <input
              type="text"
              id="message-input"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="form-control"
            />
            <Button type="submit" className="btn btn-success">
              Send
            </Button>
          </div>
        </form>
      </div>
      <PharmacistFooter />
    </div>
  );
};

export default MyChat;
