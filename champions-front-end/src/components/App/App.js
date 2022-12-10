import React from 'react';
import HeaderContainer from '../../Container/Header/HeaderContainer';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //navDrawerOpen: false
        };
    }

    render() {

        return (
            <div className = "app" >
                <HeaderContainer />
                <div className="appMainDiv" >
                    <div className="appLeftDrawer" >
                      
                    </div>
                    <div className="appPage" >
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}


export default App;