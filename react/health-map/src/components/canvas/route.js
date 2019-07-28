/**
 * @file route.js
 * @description Route component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChromePicker } from 'react-color';

import { actions } from './../../actions/incidences';
// import { thunks } from './../../actions/thunks/routes';

import './route.css';

/**
 *
 */
class Route extends React.Component {
  state = {
    loadedRoute: false,
    isColorSketchVisible: false,
    colorSketchX: 0,
    colorSketchY: 0
  }
  componentDidUpdate() {

  }
  componentDidMount() {

  }
  toggleColorSketchVisibility = (e) => {
    this.setState({
      isColorSketchVisible: !this.state.isColorSketchVisible,
      colorSketchX: e ? e.clientX : 0,
      colorSketchY: e ? e.clientY : 0
    });
  }
  handleColorChange = (routeId, color) => {
    this.props.changeRouteColor(routeId, color.hex);
  }
  render() {
    const {
      data
    } = this.props;

    let actionImg = 'https://cdn.shippify.co/icons/icon-visibility-off-gray.svg';
    if (data.get('isVisible')) {
      actionImg = 'https://cdn.shippify.co/icons/icon-visibility-on-gray.svg';
    }
    if (data.get('isLoading')) {
      actionImg = 'https://cdn.shippify.co/images/img-loading.svg';
    }

    let actionStyle = {
      width: '22px',
      height: '19px',
      padding: '2.5px 1px',
      minWidth: '22px',
      minHeight: '19px'
    };
    if (data.get('isVisible')) {
      actionStyle = {
        width: '22px',
        height: '15px',
        padding: '4.5px 1px',
        minWidth: '22px',
        minHeight: '15px'
      };
    }
    if (data.get('isLoading')) {
      actionStyle = {
        width: '22px',
        height: '22px',
        padding: '1px',
        minWidth: '22px',
        minHeight: '22px'
      };
    }

    return (
      <div className="route">
        <div className="route-description">
          <div className="route-id">
            {
              'id'
            }
          </div>
          <div className="route-deliveries">
            { '3' }
          </div>
        </div>
        <div className="route-companies">
          {
            'companies'
          }
        </div>
        <div className="route-actions">
          <img
            src={actionImg}
            alt={'Visibility'}
            style={actionStyle}
            className={
              data.get('isLoading') ?
                'spin icon-visibility' : 'icon-visibility'
            }/>
          <span
            className="color"
            style={{ backgroundColor: data.get('color') }}
            onClick={(e) => {
              this.toggleColorSketchVisibility(e);
              e.stopPropagation();
            }}>
          </span>
          {
            this.state.isColorSketchVisible &&
            <div
              className="color-picker"
              style={{
                top: ((this.state.colorSketchY + 242) > window.innerHeight) ?
                  (window.innerHeight - 258) :
                  this.state.colorSketchY,
                left: this.state.colorSketchX + 16
              }}
              onMouseLeave={() => this.toggleColorSketchVisibility()}>
              <ChromePicker
                color={this.props.data.get('color')}
                onChange={(color) => {
                  this.handleColorChange(
                    this.props.data.get('id'),
                    color
                  );
                }}/>
            </div>
          }
          <div style={{ width: '16px' }}></div>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  changeRouteColor: actions.changeRouteColor
}, dispatch);


export default connect(
  null,
  mapDispatchToProps
)(Route);
