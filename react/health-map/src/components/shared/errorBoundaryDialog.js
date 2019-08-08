/**
 * @file errorBoundary.js
 * @description Error Boundary for dialog components. Catches the errors and
 *              displays a fallback UI
 * @author Denny K. Schuldt
 */

import React from 'react';


/**
 *
 */
class ErrorBoundaryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    console.log(error);
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.log(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="shy-dialog" onClick={this.props.onClose}>
          <div className="shy-dialog-content-wrapper">
            <div
              className="shy-dialog-content"
              onClick={(e) => e.stopPropagation()}>
              <div className="shy-dialog-header">
                <div className="shy-dialog-header-content">
                  <img
                    className="shy-error-icon"
                    src="https://cdn.shippify.co/icons/icon-error-white.svg"
                    alt=""/>
                  { 'Oh no!' }
                </div>
                <img
                  className="shy-dialog-close"
                  src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                  alt=""
                  onClick={this.props.onClose}/>
              </div>
              <div className="shy-dialog-body shy-dialog-body-sm">
                <p className="shy-dialog-body-text-detail">
                  {
                    'Algo salió mal. Por favor, inténtalo de nuevo'
                  }
                </p>
                <div className="shy-dialog-body-buttons">
                  <button
                    className="shy-btn shy-btn-default"
                    onClick={this.props.onClose}>
                    { window.translation('CLOSE') }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


export default ErrorBoundaryDialog;
