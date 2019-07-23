/**
 * @file backgroundJobs.js
 * @description Background Jobs dialog to display the progress
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/backgroundJobs';
import { cancelBackgroundJob } from './../../services/remoteAPI';

import './backgroundJobs.css';


/**
 *
 */
class BackgroundJob extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false,
    cancelError: ''
  }
  cancelRequest = () => {
    const { apiUrl, apiToken, data, removeBackgroundJob } = this.props;
    const self = this;
    self.setState({
      loading: true,
      failed: false,
      canceled: false,
      cancelError: ''
    }, () => {
      cancelBackgroundJob({ jobId: data.get('id') }, { apiUrl,
        apiToken })
        .then(() => {
          self.setState({
            loading: false,
            succeed: true,
            failed: false
          });
          removeBackgroundJob(data.get('id'));
        })
        .catch(() => {
          self.setState({
            loading: false,
            succeed: false,
            failed: true,
            cancelError: 'Something went wrong. Please try again'
          });
        });
    });
  }
  render() {
    const { data } = this.props;
    return (
      <div className="shy-background-job">
        <div className="shy-background-job-description">
          <span className="shy-background-job-description-id">
            { `${window.translation('Job ID')}: ${data.get('id')}` }
          </span>
          <span className="shy-background-job-description-type">
            { `${window.translation('Type')}: ${data.get('type')}` }
          </span>
        </div>
        <div className="shy-progress-bar-container">
          <div
            className="shy-progress-bar"
            style={{ 'width': `${data.get('progress')}%` }}>
          </div>
        </div>
        <div className="shy-background-job-progress">
          { `${data.get('progress')}% ${window.translation('completed')}` }
        </div>
        <div className="shy-background-job-footer">
          {
            this.state.loading ?
              <button
                className="shy-btn shy-btn-default"
                disabled>
                { `${window.translation('CANCELING')}...` }
                <img
                  className="shy-btn-icon spin"
                  src="https://cdn.shippify.co/images/img-loading.svg"/>
              </button> :
              <div className="flex flex-center">
                {
                  (this.state.cancelError.length > 0) &&
                  <span className="footer-cancel-error">
                    {
                      this.state.cancelError
                    }
                  </span>
                }
                <button
                  className="shy-btn shy-btn-default"
                  onClick={this.cancelRequest}>
                  {
                    window.translation('CANCEL')
                  }
                </button>
              </div>
          }
        </div>
      </div>
    );
  }
}

/**
 *
 */
class BackgroundJobs extends React.Component {
  render() {
    const {
      isMaximized, toggleDialog, jobs, apiUrl, apiToken, removeBackgroundJob
    } = this.props;
    return (
      isMaximized ?
        <div className="shy-dialog" onClick={() => toggleDialog()}>
          <div className="shy-dialog-content-wrapper">
            <div
              className="shy-dialog-content"
              onClick={(e) => e.stopPropagation()}>
              <div className="shy-dialog-header shy-dialog-header-hidden">
                <div></div>
                <img
                  className="shy-dialog-close shy-dialog-minimize"
                  src="https://cdn.shippify.co/icons/icon-minimize-gray.svg"
                  alt=""
                  onClick={() => toggleDialog()}/>
              </div>
              <div className="shy-dialog-body shy-background-jobs-dialog">
                <div className="shy-background-jobs-description">
                  <img
                    className="spin"
                    src="https://cdn.shippify.co/images/img-gear.svg"
                    alt=""/>
                  <span>
                    { window.translation('Processing') }
                  </span>
                  <div>
                    <p>
                      {
                        window.translation('Some processes are being executed.')
                      }
                    </p>
                    <p>
                      {
                        window.translation('Please wait until the processes are finished.')
                      }
                    </p>
                  </div>
                </div>
                <div className="background-jobs">
                  {
                    jobs.map((job, idx) => (
                      <BackgroundJob
                        key={idx}
                        data={job}
                        apiUrl={apiUrl}
                        apiToken={apiToken}
                        removeBackgroundJob={removeBackgroundJob}/>
                    )).toArray()
                  }
                </div>
              </div>
            </div>
          </div>
        </div> :
        <div
          onClick={() => toggleDialog()}
          className="shy-background-jobs-minimized">
          <div className="shy-background-jobs-minimized-header">
            <img
              className="spin"
              src="https://cdn.shippify.co/images/img-gear.svg"
              alt=""/>
            <span>
              { window.translation('Processing') }
            </span>
          </div>
          <div className="shy-background-jobs-minimized-body">
            {
              jobs.map((job, idx) => (
                <div key={idx} className="background-job-minimized">
                  <div className="background-job-minimized-progress-bar-container">
                    <div
                      style={{ 'width': `${job.get('progress')}%` }}
                      className="background-job-minimized-progress-bar">
                    </div>
                  </div>
                </div>
              )).toArray()
            }
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
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    jobs: state.getIn(['backgroundJobs', 'jobs']),
    isMaximized: state.getIn(['backgroundJobs', 'isMaximized'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  toggleDialog: actions.toggleDialog,
  removeBackgroundJob: actions.removeBackgroundJob
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackgroundJobs);
