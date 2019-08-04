/**
 * @file hmSidebar.js
 * @description Sidebar Component
 *
 */


import React from 'react';
import { 
  FaTimes,
  FaRegHospital,
  FaHeartbeat,
  FaInfoCircle,
  FaCity,
  FaSignOutAlt
} from 'react-icons/fa';
import { connect } from 'react-redux';

import './hmSidebar.css';


class HMSidebar extends React.Component {

  render() {
    const {
      onSetSidebarOpen
    } = this.props;
    return (
      <div className="hm-sidebar-container">
        <div className="hm-sidebar-header">
          <div className="hm-sidebar-header-content">
            <div
              onClick={() => {
                onSetSidebarOpen(false);
              }}>
              <FaTimes
                size={32}
                color="#0092E1"/>
            </div>
            <span className="hm-sidebar-name">
              {
                'Dr. Leonardo Kuffo'
              }
            </span>
          </div> 
        </div>
        <div
          className="hm-sidebar-content">
          <div>
            <a
              href="/health-map"
              className="hm-sidebar-option-selected">
              <FaHeartbeat
                size={22}/>
              <span
                className="hm-sidebar-option-text">
                {
                  'Mapa Epidemiológico de Guayaquil'
                }
              </span>
            </a>
            <a
              href="/instituciones"
              className="hm-sidebar-option">
              <FaRegHospital
                size={22}/>
              <span
                className="hm-sidebar-option-text">
                {
                  'Instituciones colaboradoras'
                }
              </span>
            </a>
            <a
              href="/info"
              className="hm-sidebar-option">
              <FaInfoCircle
                size={22}/>
              <span
                className="hm-sidebar-option-text">
                {
                  'Mas información'
                }
              </span>
            </a>
            <a
              className="hm-sidebar-option">
              <FaCity
                size={22}/>
              <span
                className="hm-sidebar-option-text">
                {
                  'DataCity'
                }
              </span>
            </a>
          </div>
          <div>
            <a
              href="/logout"
              className="hm-sidebar-option">
              <FaSignOutAlt
                size={22}/>
              <span
                className="hm-sidebar-option-text">
                {
                  'Cerrar Sesión'
                }
              </span>
            </a>
          </div>
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
    username: state.getIn(['general', 'username'])
  };
};

/**
 *
 */
export default connect(
  mapStateToProps
)(HMSidebar);