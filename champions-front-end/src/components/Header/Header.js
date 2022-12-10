import React, { Component } from 'react';
import history from '../../routes/customhistory';
import Badge from '@material-ui/core/Badge';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            logo: require('../../assests/images/Header/headerLogo.svg'),
            defaultProfileImage: require('../../assests/images/Header/defaultProgileImage.png'),
            name: '',
            profileImage: '',
            notificationCount: 0,
            notifications: [],
        }
        this.auth = null;
    }

    componentDidMount() {
        let { userData } = this.props;
        if (userData) {
            this.setState({
                name: userData.name
            });
        }
    }

   

    static getDerivedStateFromProps(props, current_state) {
        let { userData } = props;
        if (userData) {
            return {
                name: userData.name,
            }
        }
        else {
            return null;
        }
    }

    goto = (to) => {
        switch (to) {
            case "signout":
                this.handleLogout();
                break;
            default:
            // default
        }

    }
    handleLogout = () => {
        this.props.setUser(null);
        localStorage.clear();
        history.replace('/login');
    }

    _renderDropdown = () => {
        return (
            <div className="dropDown" >
                <div className="dropDownItemDiv" onClick={() => this.goto('signout')} >
                    <label className="dropDownMenuLabel" >
                        Log out
                    </label>
                </div>
            </div>
        )
    }

    render() {
        let { logo, defaultProfileImage, name, profileImage, notificationCount } = this.state;
        return (
            <div className="header">
                <div className="headerMainDiv">
                    <div className="headerLogoDiv" >
                        <img src={logo} className="headerLogo" alt="headerLogo" />
                    </div>
                    <div className="headerTitleDiv" >
                        <div className="notificationLabelDiv">
                            <label className="headerTitle" > Notifications </label>
                            {
                                notificationCount !== 0 ?
                                    <div className="badgeDiv">
                                        <Badge color="secondary" badgeContent={notificationCount} >
                                            <label className="" />
                                        </Badge>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                    <div className="headerUserNameDiv"  >
                        <label className="" > Welcome, {name ? name : ""} </label>
                    </div>
                    <div className="headerUserImageDiv">
                        <img src={profileImage ? profileImage : defaultProfileImage} className="headerUserImage" alt="userImage" />
                        {this._renderDropdown()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;