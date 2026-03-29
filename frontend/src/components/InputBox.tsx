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
        <form onSubmit={handleSend} className="flex items-center p-4 border-t border-gray-300">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
                Send
            </button>
        </form>
    );
};

export default InputBox;