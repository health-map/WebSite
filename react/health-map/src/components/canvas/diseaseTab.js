
import React from 'react';
import { connect } from 'react-redux';
//import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';


import './diseaseTab.css';


/**
 *
 */
class DiseaseTab extends React.Component {
  componentDidMount() {

  }
  componentDidUpdate() {

  }
  render() {
    return (
      <div className="hm-tab-container">
        <div className="hm-datatab-firstinfo">
          {
            'Estas viendo datos de pacientes de TODAS LAS EDADES de género FEMENINO, cuya fecha de ingreso fue en VERANO del 2019. Diagnóstico de los pacientes: Enfermedades del sistema digestivo '
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
)(DiseaseTab);
