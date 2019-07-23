/**
 * @file errorDialog.js
 * @description Error dialog component
 *
 */

import React from 'react';


/**
 *
 */
class ErrorDialog extends React.Component {
  render() {
    return (
      <div className="shy-dialog" onClick={this.props.onClose}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <div className="shy-dialog-header-content">
                <img
                  className="icon-error"
                  src="https://cdn.shippify.co/icons/icon-error-white.svg"
                  alt=""/>
                { window.translation('Oh, no!') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                onClick={this.props.onClose}
                alt=""/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              <div className="shy-dialog-body-text-detail">
                { window.translation(this.props.text) }
              </div>
              <div className="shy-dialog-body-buttons">
                <button
                  className="shy-btn shy-btn-primary"
                  onClick={this.props.onClose}>
                  { window.translation('OK') }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorDialog;
