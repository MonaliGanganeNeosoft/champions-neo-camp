import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';

class Loading extends Component {
    constructor() {
        super();
        this.state = {
            color: ""
        }
    }

    render() {
        let { isLoading, label } = this.props;
        return (
            <div>
            <Modal
                open={isLoading}
            >
                <div className="loading">
                    <div className="LabelDiv" >
                        <label className="label" >{label}</label>
                    </div>
                    <div className="indicatorDiv" >
                        <CircularProgress />
                    </div>
                </div>
            </Modal>
            </div>
        );
    }
}

export default Loading;
