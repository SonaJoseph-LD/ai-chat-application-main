import React, { useState } from 'react';

const InputBox: React.FC<{ onSend: (message: string) => void }> = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSend(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Send
            </button>
        </form>
    );
};

export default InputBox;
