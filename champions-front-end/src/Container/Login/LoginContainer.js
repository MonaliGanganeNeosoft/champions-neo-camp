import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from "../../components/Login/Login";
import {ActionCreators} from '../../actions/index';


const mapStateToProps = (state, ownProps) => {
    console.log('state in container',state);
    return {
        posts : state.Posts,
        users : state.users,
        userData : state.userData,
        token: state.token,
        userSubscription: state.userSubscription
    }
}


const mapDispatchToProps = dispatch => {
    let {setUser, setToken, fetchUsers,fetchUserSubscription, } = ActionCreators;
    return bindActionCreators({setUser,fetchUsers, setToken, fetchUserSubscription}, dispatch);
}

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)

export default LoginContainer;
