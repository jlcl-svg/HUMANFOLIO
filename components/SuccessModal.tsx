import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<Props> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative animate-bounce-soft">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600 shadow-sm border border-green-200">
            <Check size={32} strokeWidth={3} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">Sucesso!</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>
          
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;