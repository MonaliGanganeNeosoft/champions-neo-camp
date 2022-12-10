import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {ActionCreators} from '../../actions/index';
import Movies from '../../components/Movies/movies';

const mapStateToProps = (state, ownProps) => {
    return {
        userData : state.userData,
        championList: state.championList
    }
}

const mapDispatchToProps = dispatch => {
    let {setUser, updateChampion} = ActionCreators;
    return bindActionCreators({setUser, updateChampion}, dispatch);
}

const MovieContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Movies);

export default MovieContainer;
