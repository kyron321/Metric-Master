import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-mm-white rounded-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-mm-white hover:text-mm-white-dark rounded-full w-6 h-6 flex items-center justify-center"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className='text-center text-2xl font-bold text-mm-white pb-4'>Enter your website details below</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;