/**
 * @file error.js
 * @description Error component
 *
 */


import React from 'react';


const Error = ({ text, onRetry, enableRefreshButton }) => {
  return (
    <div className="shy-error-container">
      <div className="shy-error">
        <img
          src="https://cdn.shippify.co/images/img-no-results.svg"
          alt=""/>
        <span>
          { window.translation(text) }
        </span>
        {
          onRetry &&
          <button
            className="shy-btn shy-btn-primary margin-top-16"
            onClick={onRetry}>
            { window.translation('RETRY') }
          </button>
        }
        {
          enableRefreshButton &&
          <button
            className="shy-btn shy-btn-primary margin-top-16"
            onClick={() => location.reload() }
            style={{ width: 'auto' }}>
            {
              window.translation('RELOAD')
            }
          </button>
        }
      </div>
    </div>
  );
};


export default Error;
