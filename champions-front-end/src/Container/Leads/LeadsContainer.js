import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {ActionCreators} from '../../actions/index';
import Leads from '../../components/Leads/Leads';

const mapStateToProps = (state, ownProps) => {
    return {
        userData : state.userData,
        leadData: state.leadData
    }
}

const mapDispatchToProps = dispatch => {
    let {setUser, updateLead} = ActionCreators;
    return bindActionCreators({setUser, updateLead}, dispatch);
}

const LeadsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Leads);

export default LeadsContainer;
