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
  FaSignOutAlt,
  FaSignInAlt
} from 'react-icons/fa';
import { connect } from 'react-redux';

import './hmSidebar.css';


class HMSidebar extends React.Component {

  render() {
    const {
      onSetSidebarOpen, user
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
                color="#FFFFFF"/>
            </div>
            <span className="hm-sidebar-name">
              {
                (user.email) ?
                  `${user.role_name} ${user.first_name} ${user.last_name}` :
                  'Visitante'
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
                  'Mapa de Salud'
                }
              </span>
            </a>
            <a
              href="/institutions"
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
              href="http://150.136.213.20/"
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
            {
              (!user.email) &&
            <a
              href="/login"
              className="hm-sidebar-option">
              <FaSignInAlt
                size={22}/>
              <span
                className="hm-sidebar-option-text">
                {
                  'Iniciar Sesión'
                }
              </span>
            </a>
            }
            {
              (user.email) &&
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
            }

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
    user: state.getIn(['general', 'user']).toJS()
  };
};

/**
 *
 */
export default connect(
  mapStateToProps
)(HMSidebar);