import React from "react";

const Modal = ({ title, onClose, onSubmit, inputs }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {inputs.map((input, index) => (
            <div key={index}>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor={`input-${index}`}
              >
                {input.label}
              </label>
              <input
                id={`input-${index}`}
                type="text"
                value={input.value}
                onChange={input.onChange}
                className="block w-full border-gray-300 rounded-md py-3 border outline-none shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;













