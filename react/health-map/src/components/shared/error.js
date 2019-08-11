/**
 * @file error.js
 * @description Error component
 *
 */


import React from 'react';
import { 
  FaExclamationCircle
} from 'react-icons/fa';


const Error = ({ text, onRetry, enableRefreshButton }) => {
  return (
    <div className="shy-error-container">
      <div className="shy-error">
        <FaExclamationCircle
          size={92}
          color="#0b7895"/>
        <span>
          { window.translation(text) }
        </span>
        {
          onRetry &&
          <button
            className="shy-btn shy-btn-primary margin-top-16"
            onClick={onRetry}>
            { 'REINTENTAR' }
          </button>
        }
        {
          enableRefreshButton &&
          <button
            className="shy-btn shy-btn-primary margin-top-16"
            onClick={() => location.reload() }
            style={{ width: 'auto' }}>
            {
              'RECARGAR'
            }
          </button>
        }
      </div>
    </div>
  );
};


export default Error;
