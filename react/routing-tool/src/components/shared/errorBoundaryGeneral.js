/**
 * @file errorBoundaryGeneral.js
 * @description General Error boundary component
 * @since
 *
 */

import React from 'react';

import Error from './error';


/**
 *
 */
class ErrorBoundaryGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(error);
    console.log(info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex full-width full-height"
          style={{
            position: 'fixed',
            backgroundColor: '#f6f6f6'
          }}>
          <Error
            enableRefreshButton={true}
            text={ window.translation('There has been an unexpected error. Please reload your browser.') }/>
        </div>
      );
    }
    return this.props.children;
  }
}


export default ErrorBoundaryGeneral;
