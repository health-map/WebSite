/**
 * @file incidence.js
 * @description incidence component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChromePicker } from 'react-color';

import { actions } from '../../actions/incidences';

import './incidence.css';

/**
 *
 */
class Incidence extends React.Component {
  state = {
    loadedincidence: false,
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
  handleColorChange = (incidenceId, color) => {
    this.props.changeIncidenceColor(incidenceId, color.hex);
  }
  toggleIncidenceVisibility = (incidenceId, isVisible) => {
    this.props.toggleIncidenceVisibility(incidenceId, isVisible);
  }
  render() {
    const {
      incidence
    } = this.props;

    console.log(incidence);

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
            incidence.name
          }
        </div>
        <div className="incidence-value">
          {
            incidence.value
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
          <span
            className="color"
            style={{ backgroundColor: incidence.color }}
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
                color={incidence.color}
                onChange={(color) => {
                  this.handleColorChange(
                    incidence.id,
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
  changeIncidenceColor: actions.changeIncidenceColor,
  toggleIncidenceVisibility: actions.toggleIncidenceVisibility
}, dispatch);


export default connect(
  null,
  mapDispatchToProps
)(Incidence);
