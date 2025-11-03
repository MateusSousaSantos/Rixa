import React, { useEffect, useState } from 'react';
import { FiX, FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';
import type { Toast as ToastType } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/90 border-green-400/50 text-white';
      case 'error':
        return 'bg-red-500/90 border-red-400/50 text-white';
      case 'info':
        return 'bg-rixa-blue/90 border-rixa-blue/50 text-rixa-cream';
      default:
        return 'bg-rixa-dark/90 border-rixa-blue/50 text-rixa-cream';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheck size={18} />;
      case 'error':
        return <FiAlertCircle size={18} />;
      case 'info':
        return <FiInfo size={18} />;
      default:
        return <FiInfo size={18} />;
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg
        transform transition-all duration-300 ease-out
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getToastStyles()}
        min-w-[300px] max-w-[400px]
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      {/* Message */}
      <div className="flex-1 text-sm font-medium">
        {toast.message}
      </div>
      
      {/* Close Button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Toast;