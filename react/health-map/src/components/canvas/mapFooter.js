
import React from 'react';
import { connect } from 'react-redux';
//import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';


import './mapFooter.css';


/**
 *
 */
class MapFooter extends React.Component {
  componentDidMount() {

  }
  componentDidUpdate() {

  }
  render() {
    return (
      <div className="hm-footer-container">
        <div className="hm-footer-info">
          {
            'AVISO: La información de pacientes es directamente recolectada de los registros médicos de las instituciones de salud | El propósito de este mapa es la visualización | La incidencia de enfermedades no evidencia la existencia de zonas de riesgo | Error medido en las inferencias geográficas de los pacientes: ± 8% '
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapFooter);
