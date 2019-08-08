/**
 * @file incidence.js
 * @description incidence component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from '../../actions/incidences';

import './incidence.css';

/**
 *
 */
class Incidence extends React.Component {
  state = {
    loadedincidence: false
  }
  componentDidUpdate() {

  }
  componentDidMount() {

  }
  toggleIncidenceVisibility = (incidenceId, isVisible) => {
    this.props.toggleIncidenceVisibility(incidenceId, isVisible);
  }
  render() {
    let {
      incidence
    } = this.props;

    incidence = incidence.properties;

    let actionImg = 'https://cdn.shippify.co/icons/icon-visibility-off-gray.svg';
    if (incidence.isVisible) {
      actionImg = 'https://cdn.shippify.co/icons/icon-visibility-on-gray.svg';
    }

    let actionStyle = {
      width: '22px',
      height: '19px',
      padding: '2.5px 1px',
      minWidth: '22px',
      minHeight: '19px'
    };
    if (incidence.isVisible) {
      actionStyle = {
        width: '22px',
        height: '15px',
        padding: '4.5px 1px',
        minWidth: '22px',
        minHeight: '15px'
      };
    }

    return (
      <div className="incidence">
        <div className="incidence-sector">
          {
            incidence.geofence_name
          }
        </div>
        <div className="incidence-value">
          {
            incidence.metrics.absolute
          }
        </div>
        <div className="incidence-actions">
          <img
            src={actionImg}
            alt={'Visibility'}
            style={actionStyle}
            className="icon-visibility"
            onClick={() => {
              this.toggleIncidenceVisibility(
                incidence.id, 
                !incidence.isVisible
              );
            }}/>
          <div style={{ width: '16px' }}></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    incidencesFilters: state.getIn(['incidences', 'filters'])
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleIncidenceVisibility: actions.toggleIncidenceVisibility
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Incidence);
