import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message.id, onClose]);

  return (
    <div className="pointer-events-auto bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up mb-2">
      <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
      <span className="text-sm font-medium">{message.text}</span>
      <button onClick={() => onClose(message.id)} className="text-gray-400 hover:text-white ml-2">
        ×
      </button>
    </div>
  );
};