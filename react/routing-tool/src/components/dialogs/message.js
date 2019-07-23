/**
 * @file message.js
 * @description Displays a message from the general store
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/general';


/**
 *
 */
class Message extends React.Component {
  render() {
    const { message, showMessage } = this.props;
    return (
      <div className="shy-dialog" onClick={() => showMessage('') }>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <div className="shy-dialog-header-content">
                <img
                  className="icon-info"
                  src="https://cdn.shippify.co/icons/icon-info-outline-white.svg"
                  alt=""/>
                { window.translation('Warning') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                onClick={() => showMessage('') }
                alt=""/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              <div className="shy-dialog-body-text-detail">
                { message }
              </div>
              <div className="shy-dialog-body-buttons">
                <button
                  onClick={() => showMessage('') }
                  className="shy-btn shy-btn-primary">
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

/**
 *
 */
const mapStateToProps = (state) => {
  return {
    message: state.getIn(['general', 'message'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  showMessage: actions.showMessage
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);
