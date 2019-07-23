/**
 * @file route.js
 * @description Route component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChromePicker } from 'react-color';
import { List } from 'immutable';

import RouteMenu from './routeMenu';
import { actions } from './../../actions/routes';
import { thunks } from './../../actions/thunks/routes';
const { loadRoute: loadRouteRequest } = thunks;

import './route.css';

/**
 *
 */
class Route extends React.Component {
  state = {
    loadedRoute: false,
    isColorSketchVisible: false,
    colorSketchX: 0,
    colorSketchY: 0,
    isRouteMenuVisible: false
  }
  componentDidUpdate() {
    if (
      this.props.data.get('isVisible') &&
      !this.props.data.get('points') &&
      (this.props.data.get('id') !== 'Single') &&
      !this.state.loadedRoute
    ) {
      this.setState({
        loadedRoute: true
      }, () => {
        this.props.loadRoute(
          this.props.data.get('id'),
          this.props.data.get('schedule').reduce((points, currentPoint) => {
            points.push(
              {
                latitude: currentPoint.getIn(['data', 'location', 'geopoint', 'latitude']),
                longitude: currentPoint.getIn(['data', 'location', 'geopoint', 'longitude'])
              }
            );
            return points;
          }, [])
        );
      });
    }
  }
  componentDidMount() {
    if (this.props.data.get('id') === 'Single') {
      this.props.toggleRouteVisibility(
        this.props.data.get('id'),
        true
      );
    }
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
  toggleRouteMenu = () => {
    this.setState({
      isRouteMenuVisible: !this.state.isRouteMenuVisible
    });
  }
  render() {
    const {
      data, selectRoute, selectRouteIdToAssign, setListWidth,
      selectRouteIdToAutoMerge
    } = this.props;
    const deliveries = [];
    data.get('schedule').map((stop) => {
      const id = stop.getIn(['data', 'id']);
      if (!deliveries.find(d => d === id)) {
        deliveries.push(id);
      }
    });

    const tags = data.get('schedule').reduce((computedTags, stop) => {
      let stopTags = stop.getIn(['data', 'tags']);
      if (stopTags && stopTags.size) {
        stopTags = stopTags.filter((tag) => {
          if (computedTags.size) { // filter repeated tags
            return !computedTags.some((ctag) => {
              return tag.get('name') === ctag.get('name');
            });
          } 
          return true;
        });
        return computedTags.concat(stopTags);
      }
      return computedTags;
    }, List());

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

    const companies = data.get('companies')
      .toArray().map((company, idx) => {
        return (
          <div key={idx}>
            {company.get('name')}
          </div>
        );
      });

    return (
      <div
        className="route"
        onClick={
          (data.get('id') !== 'Single') ?
            () => selectRoute(data.get('id')) :
            () => {}
        }>
        <img
          src={
            this.props.data.get('isSelected') ?
              'https://cdn.shippify.co/images/img-checkbox-on.svg' :
              'https://cdn.shippify.co/images/img-checkbox-off.svg'
          }
          style={
            (this.props.data.get('id') === 'Single') ?
              { 'visibility': 'hidden' } :
              {}
          }
          onClick={(e) => {
            this.props.toggleRouteSelection(
              this.props.data.get('id'),
              !this.props.data.get('isSelected')
            );
            e.stopPropagation();
          }}/>
        {
          !this.props.isResponsive &&
          <div className="route-description">
            <div className="route-id">
              {
                (data.get('id') === 'Single') ?
                  window.translation('Single deliveries') :
                  data.get('id')
              }
            </div>
            <div className="route-deliveries">
              { `${deliveries.length} ${window.translation('deliveries')}` }
            </div>
          </div>
        }
        {
          !this.props.isResponsive &&
          <div className="route-companies">
            {
              companies
            }
            {
              (this.props.data.get('id') !== 'Single') &&
              !!tagsDisplayed.size &&
              <div className='flex'>
                <div className="shy-route-tags">
                  {
                    tagsDisplayed
                  }
                </div>
              </div>
            }
          </div>
        }
        {
          this.props.isResponsive &&
          <div className="full-width">
            <div>
              <strong>
                {
                  (data.get('id') === 'Single') ?
                    window.translation('Single deliveries') :
                    data.get('id')
                }&nbsp;-&nbsp;
                {
                  `${deliveries.length} ${window.translation('deliveries')}`
                }
              </strong>
            </div>
            <div>
              { companies }
            </div>
          </div>
        }
        <div className="route-actions">
          <img
            src={actionImg}
            alt={window.translation('Visibility')}
            onClick={(e) => {
              this.props.toggleRouteVisibility(
                data.get('id'),
                !data.get('isVisible')
              );
              e.stopPropagation();
            }}
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
          <img
            src="https://cdn.shippify.co/icons/icon-vertical-menu-gray.svg"
            className="icon-vertical-menu"
            alt=""
            onClick={(e) => {
              this.toggleRouteMenu();
              e.stopPropagation();
            }}/>
          {
            this.state.isRouteMenuVisible &&
            <RouteMenu
              routeId={data.get('id')}
              setListWidth={setListWidth}
              toggleRouteMenu={this.toggleRouteMenu}
              selectRouteIdToAssign={selectRouteIdToAssign}
              selectRouteIdToAutoMerge={selectRouteIdToAutoMerge} />
          }
          <div style={{ width: '16px' }}></div>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  loadRoute: loadRouteRequest,
  toggleRouteSelection: actions.toggleRouteSelection,
  toggleRouteVisibility: actions.toggleRouteVisibility,
  changeRouteColor: actions.changeRouteColor,
  selectRoute: actions.selectRoute
}, dispatch);


export default connect(
  null,
  mapDispatchToProps
)(Route);
