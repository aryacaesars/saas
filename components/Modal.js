import React from 'react';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <button onClick={onClose} className="btn rounded-xl btn-primary">
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Modal;