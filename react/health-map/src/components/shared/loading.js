/**
 * @file loading.js
 * @description Loading component
 *
 */


import React from 'react';


const Loading = () => {
  return (
    <div className="shy-loading-container">
      <img
        className="shy-loading"
        src="https://cdn.shippify.co/images/img-loading.svg"
        alt=""/>
      <span className="margin-top-m">
        { `${window.translation('Processing')}...` }
      </span>
    </div>
  );
};


export default Loading;
