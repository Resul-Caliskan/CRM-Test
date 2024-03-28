import React from 'react';

const AreUSure = ({ isOpen, onClose, onConfirm, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-10 bg-opacity-50">
          <div className="bg-white p-8 rounded ">
            {children}
            <div className="flex justify-center mt-4">
              <button
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-200/20 dark:shadow-lg dark:shadow-red-500/50 font-medium rounded-lg text-sm px-[32px] py-2.5 text-center mx-4"
                onClick={onConfirm}
              >
                Sil
              </button>
              <button
                className="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-200/20 dark:shadow-lg dark:shadow-gray-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-l-2"
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
