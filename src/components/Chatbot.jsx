import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../aiService';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hello! I'm your GymPro AI assistant. How can I help you with your fitness questions today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        parts: msg.parts.map(part => ({ text: part.text })),
      }));
      
      const responseText = await getChatbotResponse(currentInput, history);
      const botMessage = { role: 'model', parts: [{ text: responseText }] };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatWindowStyle = {
    backgroundImage: `url('https://i.pinimg.com/736x/89/63/9e/89639e53ea82eb0354718aee11cfc593.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed z-50 bottom-0 right-0 left-0 top-0 sm:top-auto sm:bottom-24 sm:right-6 sm:left-auto sm:w-80 sm:h-[28rem] bg-white rounded-none sm:rounded-xl shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full sm:translate-y-4 pointer-events-none'}`}>
        <div className="bg-sky-600 text-white p-3 rounded-t-none sm:rounded-t-xl flex justify-between items-center">
          <h3 className="font-bold text-center flex-grow">GymPro AI Assistant</h3>
          <button onClick={onClose} className="text-white hover:bg-sky-700 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Chat Area with Background */}
        <div className="flex-grow p-4 overflow-y-auto relative" style={chatWindowStyle}>
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          <div className="relative z-10">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg py-2 px-3 max-w-xs text-white ${msg.role === 'user' ? 'bg-sky-500 bg-opacity-80' : 'bg-slate-600 bg-opacity-80'}`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg py-2 px-3 bg-slate-600 bg-opacity-80 text-white">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-2 border-t flex items-center bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <button type="submit" className="ml-2 p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
