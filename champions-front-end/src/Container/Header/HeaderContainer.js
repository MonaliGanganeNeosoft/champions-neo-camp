import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {ActionCreators} from '../../actions/index';
import Header from '../../components/Header/Header';

const mapStateToProps = (state, ownProps) => {
    return {
        userData : state.userData
    }
}

const mapDispatchToProps = dispatch => {
    let {setUser,userLogout} = ActionCreators;
    return bindActionCreators({setUser,userLogout}, dispatch);
}

const HeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

export default HeaderContainer;
