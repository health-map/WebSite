/**
 * @file successful.js
 * @description Successfull component
 *
 */

import React from 'react';


const Successful = ({ text }) => (
  <div className="shy-success-container">
    <div className="shy-success">
      <img src="https://cdn.shippify.co/images/img-done.svg"/>
      <span>
        {
          text
        }
      </span>
    </div>
  </div>
);


export default Successful;
