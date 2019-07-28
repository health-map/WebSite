/**
 * @file polygonRow.js
 * @description Polygon row component. Contains all the deliveries inside
 *              the polygon.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChromePicker } from 'react-color';

import Step from './step';
import { actions } from './../../actions/polygon';

import './polygonRow.css';


/**
 *
 */
class PolygonRow extends React.Component {
  state = {
    isOpened: false,
    isColorSketchVisible: false
  }
  render() {
    const { steps, deletePolygon, polygonId, changeColor } = this.props;
    return (
      <div className="polygon">
        <div
          className="polygon-header"
          onClick={() => this.setState({ isOpened: !this.state.isOpened })}>
          <div className="polygon-deliveries-number">
            {
              window.translation('*NUMBER* Deliveries')
                .replace('*NUMBER*', steps.size)
            }
          </div>
          <div
            className="polygon-color"
            style={{
              backgroundColor: steps.getIn([0, 'color'])
            }}
            onClick={() => {
              this.setState({ isColorSketchVisible: true });
            }}>
          </div>
          {
            this.state.isColorSketchVisible &&
            <div
              className="polygon-color-picker"
              onMouseLeave={() => {
                this.setState({ isColorSketchVisible: false });
              }}>
              <ChromePicker
                color={ steps.getIn([0, 'color']) }
                onChange={(color) => {
                  changeColor(polygonId, color.hex);
                }}/>
            </div>
          }
          <img
            onClick={(e) => {
              deletePolygon(polygonId);
              e.preventDefault();
            }}
            className="polygon-delete icon-delete"
            src="https://cdn.shippify.co/icons/icon-delete-gray.svg"
            alt=""/>
        </div>
        {
          this.state.isOpened &&
          <div className="polygon-body">
            {
              steps.map((step, idx) => (
                <Step
                  key={idx}
                  data={step}
                  polygonId={polygonId}
                  color={steps.getIn([0, 'color'])}/>
              ))
            }
          </div>
        }
      </div>
    );
  }
}


/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  changeColor: actions.changeColor,
  deletePolygon: actions.deletePolygon
}, dispatch);


export default connect(
  null,
  mapDispatchToProps
)(PolygonRow);
