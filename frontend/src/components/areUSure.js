import React from 'react';

const AreUSure = ({ isOpen, onClose, onConfirm, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            {children}
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                onClick={onConfirm}
              >
                Sil
              </button>
              <button
                className="ml-4 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                onClick={onClose}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AreUSure;
