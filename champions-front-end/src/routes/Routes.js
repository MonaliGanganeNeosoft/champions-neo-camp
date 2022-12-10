import React from 'react'
import { Router } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import history from './customhistory';
import { IntlProvider } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import messages from '../messages';
import NotFound from "./NotFound";
import LoginContainer from "../Container/Login/LoginContainer";
import MovieContainer from '../Container/Movie/MovieContainer';
import HeaderContainer from '../Container/Header/HeaderContainer';
import LeadsContainer from '../Container/Leads/LeadsContainer';
import Drawer from '../components/Drawer/Drawer';
import { DRAWER_MENU_NAMES } from '../utils/Constants';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';
import CustomizedSnackbars from '../components/Common/CustomizedSnackbars';
import Loading from '../components/Common/Loading';
import LeadsActionConatiner from '../components/Leads/AddEditLeads';
import ChampionActionConatiner from '../components/Movies/AddEditChampion';
import ChampionVoteActionConatiner from '../components/Champions/Champions';
import SessionDetailsActionConatiner from '../components/sessionDetails/sessionDetails';
import ChampionOfWeekActionConatiner from '../components/Champions/championOfTheWeeks';
import SignUp from '../components/SignUp/signUp';
import ForgotPasswordComponent from '../components/ForgotPassword/forgotPassword';


class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeader: true,
            showSideBar: true,
            isSidebarOpen: true,
            selectedMenu: DRAWER_MENU_NAMES.dashboard,
            drawerClass: 'appLeftDrawer_open',
            appPageClass: 'appPage_open',
            userData: props.userData,
            check: false,
            showSnackBar: false,
            snackBarType: 'success',
            snackBarMessage: '',
            isLoading: false,
            loadingText: 'Loading ...',
        }
    }
    componentDidMount() {
        this.isPresent = true;
        let { userData } = this.props;
        if (userData) {
           // user is loogged in
        }
    }

    handleSnackBarClose = () => {
        this.setState({
            showSnackBar: false
        })
    }

    handleMenuClick = (id, name) => {
        switch (name) {
            case 'Champions':
                history.push('/champions/#');
                this.setState({
                    selectedMenu: name,
                    drawerClass: 'appLeftDrawer_open',
                    appPageClass: 'appPage_open',
                    isSidebarOpen: true
                });
                break;
            case 'Leads':
                history.push('/leads/#');
                this.setState({
                    selectedMenu: name,
                    drawerClass: 'appLeftDrawer_open',
                    appPageClass: 'appPage_open',
                    isSidebarOpen: true
                });
                break;    
            case 'Team':
                history.push('/team/#');
                this.setState({
                    selectedMenu: name,
                    drawerClass: 'appLeftDrawer_open',
                    appPageClass: 'appPage_open',
                    isSidebarOpen: true
                });
                break;     
            case 'Winners':
                history.push('/champion/champion-of-week/#');
                this.setState({
                    selectedMenu: name,
                    drawerClass: 'appLeftDrawer_open',
                    appPageClass: 'appPage_open',
                    isSidebarOpen: true
                });
                break;   
            case 'Sessions':
                history.push('/sessions/#');
                this.setState({
                    selectedMenu: name,
                    drawerClass: 'appLeftDrawer_open',
                    appPageClass: 'appPage_open',
                    isSidebarOpen: true
                });
                break;                    
            default:
                history.push('/login');
                this.setState({
                    selectedMenu: name,
                    drawerClass: 'appLeftDrawer_open',
                    appPageClass: 'appPage_open',
                    isSidebarOpen: true
                });
        }
    }
    updateHeader = () => {
        this.setState({
            check: !this.state.check
        })
    }

    hideHeader = () => {
        this.setState({
            showHeader: false,
            showSideBar: false
        })
    }
    showHeader = () => {
        this.setState({
            showHeader: true,
            showSideBar: true,
            drawerClass: 'appLeftDrawer_open',
            appPageClass: 'appPage_open'
        })
    }
    toggleSideDrawer = () => {
        this.setState({
            drawerClass: !this.state.isSidebarOpen ? 'appLeftDrawer_open' : 'appLeftDrawer_close',
            appPageClass: this.state.isSidebarOpen ? 'appPage_close' : 'appPage_open',
            isSidebarOpen: !this.state.isSidebarOpen,
        })
    }

    showSnackBar = (snackBarType, snackBarMessage) => {
        this.setState({
            showSnackBar: true,
            snackBarType,
            snackBarMessage
        })
    }

    requireAuth = ( yourComponent ) =>{
        let { userData } = this.props;
        if (userData) {
           return yourComponent;
        }
        else{
            return (<Redirect to="/login" />);
        }
    }

    render() {
        const { lang } = this.props;
        let { isLoading, loadingText, showHeader, showSideBar, selectedMenu,
            drawerClass, appPageClass, showSnackBar, snackBarType, snackBarMessage,
            isSidebarOpen } = this.state;
            return (
                <div>
                    <Loading isLoading={isLoading} label={loadingText} />
                    <CustomizedSnackbars
                        onClose={this.handleSnackBarClose}
                        variant={snackBarType}
                        message={snackBarMessage}
                        isOpen={showSnackBar}
                    />

                    <div className="app" >
                        {
                            showHeader ?
                                <HeaderContainer
                                    check={this.state.check}
                                    showSnackBar={this.showSnackBar}
                                />
                                :
                                null
                        }

                        <div className="appMainDiv" >
                            {
                                showSideBar ?
                                    <div className={drawerClass}>
                                        <Drawer
                                            handleMenuClick={this.handleMenuClick}
                                            selectedMenu={selectedMenu}
                                            toggleSideDrawer={this.toggleSideDrawer}
                                        />
                                        <div className="menuToggleButtonDiv" onClick={this.toggleSideDrawer}> 
                                            <div className="menuToggleButton" >
                                                {
                                                    isSidebarOpen ?
                                                        <i className="fas fa-angle-double-left icon"></i> :
                                                        <i className="fas fa-angle-double-right icon"></i>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }

                            <div className={showSideBar ? appPageClass : "appPage"} >
                                <IntlProvider locale={"en"} messages={messages[lang]}>
                                    <Router history={history}>
                                        <Switch>
                                            <Route exact path="/" render={(props) => <LoginContainer {...props} hideHeader={this.hideHeader} showSnackBar={this.showSnackBar} />} />
                                            <Route exact path="/login" render={(props) => <LoginContainer {...props} hideHeader={this.hideHeader} showSnackBar={this.showSnackBar} />} />
                                            <Route exact path="/signUp" render={(props) => <SignUp {...props} hideHeader={this.hideHeader} showSnackBar={this.showSnackBar} />} />
                                            <Route exact path="/forgot-password/:token" render={(props) => <ForgotPasswordComponent {...props} hideHeader={this.hideHeader} showSnackBar={this.showSnackBar} />} />
                                            <Route exact path="/champions" render={(props) => this.requireAuth(<MovieContainer {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="/leads" render={(props) => this.requireAuth(<LeadsContainer {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="/leads/Add" render={(props) => this.requireAuth(<LeadsActionConatiner {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="/champion/Add" render={(props) => this.requireAuth(<ChampionActionConatiner {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="/champion/champion-of-week" render={(props) => this.requireAuth(<ChampionOfWeekActionConatiner {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="/team" render={(props) => this.requireAuth(<ChampionVoteActionConatiner {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="/sessions" render={(props) => this.requireAuth(<SessionDetailsActionConatiner {...props} showHeader={this.showHeader} showSnackBar={this.showSnackBar} />)} />
                                            <Route exact path="*" component={NotFound} />
                                            <Redirect to="/login" />
                                        </Switch>
                                    </Router>
                                </IntlProvider>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
    }

const mapStateToProps = (state, ownProps) => {
    return {
        userData: state.userData,
        lang: "en",
    }
}

const mapDispatchToProps = dispatch => {
    let { setUser, userLogout  } = ActionCreators;
    return bindActionCreators({ setUser, userLogout }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Routes);