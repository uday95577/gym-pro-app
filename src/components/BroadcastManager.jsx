import React, { useState } from 'react';
import { generateMotivationalQuote } from '../aiService';

const BroadcastManager = ({ gymId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    setFeedback('');
    try {
      const quote = await generateMotivationalQuote();
      setMessage(quote);
    } catch (error) {
      console.error("Error generating quote:", error);
      setFeedback('Failed to generate quote.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!message.trim()) {
      setFeedback('Message cannot be empty.');
      return;
    }
    setIsSending(true);
    setFeedback('');
    try {
      const response = await fetch('/api/broadcastToAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId, message }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send broadcast.');
      }
      setFeedback(data.message);
      setMessage(''); // Clear message on success
    } catch (error) {
      console.error("Error sending broadcast:", error);
      setFeedback(error.message);
    } finally {
      setIsSending(false);
      setTimeout(() => setFeedback(''), 5000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Broadcast to Members</h3>
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a custom message or generate an AI quote..."
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
          rows="4"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleGenerateQuote}
            disabled={isGenerating}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Quote'}
          </button>
          <button
            onClick={handleSendBroadcast}
            disabled={isSending || !message.trim()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isSending ? 'Sending...' : 'Send to All Members'}
          </button>
        </div>
        {feedback && <p className="text-center text-sm text-gray-600 mt-2">{feedback}</p>}
      </div>
    </div>
  );
};

export default BroadcastManager;
