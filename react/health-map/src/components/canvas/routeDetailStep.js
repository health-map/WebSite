/**
 * @file routeDetailStep.js
 * @description Route Detail Step component
 *
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  DeliveryStatusColor,
  DeliveryStatusLabelByActivity
} from './../../constants';
import { actions } from './../../actions/routes';
import RouteDetailStepMenu from './routeDetailStepMenu';

import './routeDetailStep.css';


/**
 *
 */
class RouteDetailStep extends React.Component {
  state = {
    index: (this.props.index + 1),
    isMenuVisible: false
  }
  toggleMenu = () => {
    this.setState({
      isMenuVisible: !this.state.isMenuVisible
    });
  }
  handleIndexChange = (index) => {
    this.setState({
      index
    });
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.selectedStepIdToReorder ===
      this.props.data.first().get('id')
    ) {
      this.indexInput.focus();
    }
    if (
      (
        prevProps.selectedStepIdToReorder ===
        prevProps.data.first().get('id')
      ) &&
      (
        this.props.selectedStepIdToReorder !==
        this.props.data.first().get('id')
      )
    ) {
      this.setState({
        index: (this.props.index + 1)
      });
    }
  }
  render() {
    const {
      data, selectedStep, selectStep, routeId, isResponsive,
      selectedRouteToReorder, selectedStepIdToReorder, selectStepIdToReorder,
      changeStepOrder, selectDeliveryIdToRemoveFromRoute, containerWidth,
      selectDeliveryIdToMoveToAnotherRoute
    } = this.props;
    const step = data.first();
    const timeWindow = step.get('timeWindow');
    const startDate = moment(timeWindow ? timeWindow.get('start') : new Date());
    const endDate = moment(timeWindow ? timeWindow.get('end') : new Date());
    const relativeDate = startDate.calendar(null, {
      nextDay: '[Tomorrow]',
      nextWeek: '[Next] dddd',
      lastWeek: '[Last] dddd',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      sameElse: 'DD/MM/YYYY'
    });
    const relativeDateString = window.translation(relativeDate);
    const stepDate = startDate.isSame(endDate) ?
      `${relativeDateString} ${startDate.format('HH:mm')}` :
      `${relativeDateString} ${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`;

    const backgroundColor =
    (
      selectedStep &&
      (selectedStep.deliveryId === step.get('deliveryId')) &&
      (
        (
          (selectedStep.activityType === 'P') &&
          (step.get('activityType') === 'pickup')
        ) ||
        (
          (selectedStep.activityType === 'D') &&
          (step.get('activityType') === 'dropoff')
        )
      )
    ) ?
      '#f7f7f7' : '#fff';
    const tags = step.get('tags');
    let tagsDisplayed = [];
    if (tags && tags.size) {
      tagsDisplayed = tags.map((t, idx) => {
        return (
          <span
            key={idx}
            className="shy-route-tag"
            style={{ 'backgroundColor': t.get('color') }}>
            {t.get('name')}
          </span>
        );
      });
      if (tagsDisplayed.size > 3) {
        tagsDisplayed = tagsDisplayed.slice(0, 3);
        tagsDisplayed = tagsDisplayed.concat(
          <span
            key={'3'}
            className="shy-route-tag"
            style={{ 'backgroundColor': '#757575' }}>
            ...
          </span>
        );
      }
    }

    return (
      <div
        className="route-detail-step"
        style={{ backgroundColor }}
        onClick={() => {
          this.props.selectedRouteToReorder ?
            selectStepIdToReorder(step.get('id')) :
            selectStep(
              routeId,
              step.get('deliveryId'),
              (step.get('activityType') === 'pickup') ? 'P' : 'D'
            );
        }}>
        <div className="step-content-wrapper">
          <span className="step-index">
            { (this.props.index + 1) }
          </span>
          <div className="step-content">
            <div className="step-content-address">
              { step.getIn(['location', 'address']) }
            </div>
            <div className="step-content-detail">
              {
                (step.get('activityType') === 'pickup') &&
                <div className="detail-activity">
                  <img
                    src="https://cdn.shippify.co/icons/icon-upload-gray.svg"
                    alt=""/>
                  {
                    (data.size > 1) ?
                      window.translation('Common Pickup') :
                      window.translation('Pickup')
                  }
                </div>
              }
              {
                (step.get('activityType') === 'dropoff') &&
                <div className="detail-activity">
                  <img
                    src="https://cdn.shippify.co/icons/icon-download-gray-mini.svg"
                    alt=""/>
                  {
                    (data.size > 1) ?
                      window.translation('Common Dropoff'):
                      window.translation('Dropoff')
                  }
                </div>
              }
              <div className="detail-delivery-id">
                <img
                  src="https://cdn.shippify.co/icons/icon-document-gray-mini.svg"
                  alt=""/>
                {
                  (data.size === 1) ?
                    step.get('deliveryId') :
                    window.translation('*NUMBER* deliveries')
                      .replace('*NUMBER*', data.size)
                }
              </div>
            </div>
            <div>
              {
                !!tagsDisplayed.size &&
                <div className='route-detail-tags-step'>
                  <div className='flex'>
                    <div className="shy-route-tags">
                      {
                        tagsDisplayed
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        {
          !selectedRouteToReorder &&
          <div className="step-date-wrapper">
            {
              !isResponsive &&
              <span className="step-separator"></span>
            }
            <div className="step-date">
              <div
                style={{
                  color: DeliveryStatusColor[step.get('substatus')]
                }}>
                <strong>
                  {
                    window.translation(DeliveryStatusLabelByActivity[step.get('activityType')][step.get('substatus')])
                  }
                </strong>
              </div>
              <div>
                { stepDate }
              </div>
            </div>
            <div>
              <img
                onClick={
                  (data.size > 1) ?
                    () => {} :
                    (e) => {
                      this.toggleMenu();
                      selectStep();
                      e.stopPropagation();
                    }
                }
                className={
                  (data.size > 1) ?
                    'icon-vertical-menu disabled' :
                    'icon-vertical-menu'
                }
                src="https://cdn.shippify.co/icons/icon-vertical-menu-gray.svg"
                alt=""/>
            </div>
            {
              this.state.isMenuVisible &&
              <RouteDetailStepMenu
                deliveryId={step.get('deliveryId')}
                toggleMenu={this.toggleMenu}
                containerWidth={containerWidth}
                selectDeliveryIdToRemoveFromRoute={
                  selectDeliveryIdToRemoveFromRoute
                }
                selectDeliveryIdToMoveToAnotherRoute={
                  selectDeliveryIdToMoveToAnotherRoute
                }/>
            }
          </div>
        }
        {
          selectedRouteToReorder &&
          <div className="reorder-actions-wrapper">
            <input
              className="step-index-input"
              value={this.state.index}
              onChange={(e) => this.handleIndexChange(e.target.value)}
              ref={(input) => { this.indexInput = input; }}
              disabled={selectedStepIdToReorder !== step.get('id')}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  changeStepOrder(
                    data.map((currentStep) => {
                      return currentStep.get('deliveryId');
                    }),
                    step.get('activityType'),
                    Number(this.props.index),
                    (Number(this.state.index) - 1)
                  );
                }
              }}/>
            <div className="step-actions">
              {
                (selectedStepIdToReorder === step.get('id')) ?
                  <img
                    alt=""
                    className="icon-check"
                    onClick={() => {
                      changeStepOrder(
                        data.map((currentStep) => {
                          return currentStep.get('deliveryId');
                        }),
                        step.get('activityType'),
                        Number(this.props.index),
                        (Number(this.state.index) - 1)
                      );
                    }}
                    src="https://cdn.shippify.co/icons/icon-check-green.svg"/> :
                  <img
                    alt=""
                    className="icon-edit"
                    src="https://cdn.shippify.co/icons/icon-edit-gray.svg"/>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

/**
 *
 */
const mapStateToProps = (state) => {
  const route = state.getIn(['routes', 'data'])
    .filter((r) => (r.get('id') === state.getIn(['routes', 'selectedRouteId'])))
    .first();
  return {
    routeId: route.get('id')
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectStep: actions.selectStep,
  changeStepOrder: actions.changeStepOrder
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteDetailStep);
