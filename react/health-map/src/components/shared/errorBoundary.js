/**
 * @file errorBoundary.js
 * @description Error Boundary for components. Catches the errors and displays a fallback UI
 * @author Denny K. Schuldt
 */

import React from 'react';

import './errorBoundary.css';

/**
 *
 */
class ErrorBoundary extends React.Component {
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
        <p className="error-boundary-message">
          { window.translation('Something went wrong. Please try again') }
        </p>
      );
    }
    return this.props.children;
  }
}


export default ErrorBoundary;
