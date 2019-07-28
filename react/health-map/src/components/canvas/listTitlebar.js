
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Timer from './timer';
import { actions as polygonActions } from './../../actions/polygon';
import { actions } from './../../actions/routes';

import './listTitlebar.css';


/**
 *
 */
class ListTitlebar extends React.Component {
  render() {
    const {
      selectedRoute, selectRoute, selectedRouteIdToAddDeliveries,
      clearPolygons
    } = this.props;
    return (
      selectedRouteIdToAddDeliveries ?
        <div></div> :
        <div
          className="shy-list-titlebar"
          style={{
            backgroundColor: selectedRoute ?
              selectedRoute.get('color') : '#ef404b'
          }}>
          <div className="flex flex-align-center">
            {
              selectedRoute ?
                <img
                  className="icon-back"
                  src="https://cdn.shippify.co/icons/icon-arrow-back-white.svg"
                  alt="Back"
                  onClick={() => {
                    clearPolygons();
                    selectRoute();
                  }}/> :
                <img
                  className="icon-close"
                  src="https://cdn.shippify.co/icons/icon-close-white.svg"
                  alt="Back"
                  onClick={() => window.location = '/' }/>
            }
            <Timer/>
          </div>
        </div>
    );
  }
}


/**
 *
 */
const mapStateToProps = state => {
  return {
    selectedRouteIdToAddDeliveries: state.getIn(['routes', 'selectedRouteIdToAddDeliveries'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectRoute: actions.selectRoute,
  clearPolygons: polygonActions.clearPolygons
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListTitlebar);
