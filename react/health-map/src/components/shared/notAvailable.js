import React from 'react';

import './notAvailable.css';

const NotAvailable = ({ title, detail }) => (
  <div className="shpy-NotAvailable-container">
    <div className="shpy-NotAvailable">
      <img src="https://cdn.shippify.co/images/img-no-results.svg"/>
      <span className="shpy-NotAvailable-title">{title}</span>
      { detail &&
        <span className="shpy-NotAvailable-detail">{detail}</span> }
    </div>
  </div>
);

export default NotAvailable;
