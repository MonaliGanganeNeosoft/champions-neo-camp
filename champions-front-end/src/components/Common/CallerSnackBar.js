import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    callinButton: {
        height: 20,
        width: 35,
    },
    backGroundColorRed:{
        backgroundColor: 'red'
    },
    backGroundColorGreen:{
        backgroundColor: 'lightgreen'
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, onAcceptAudio, onAcceptVideo, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <Button variant="fab" color="primary" key= "audioCalling"
                className={classNames(classes.backGroundColorGreen, classes.callinButton)}
                    onClick={onAcceptAudio}
                >
                    <i className="fas fa-phone callingButtonIcon" />
                </Button>,
                <Button variant="fab" color="primary" key= "videoCalling"
                className={classNames(classes.backGroundColorGreen, classes.callinButton)}
                    onClick={onAcceptVideo}
                >
                    <i className="fas fa-video callingButtonIcon" />
                </Button>,
                <Button variant="fab" color="primary" key= "cancelCalling"
                className={classNames(classes.backGroundColorRed, classes.callinButton)}
                    onClick={onClose}
                >
                    <i className="fas fa-times callingButtonIcon" />
                </Button>
            ]}
            {...other}
        />
    );
}

MySnackbarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    onAcceptAudio: PropTypes.func,
    onAcceptVideo: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
});

class CallerSnackBar extends React.Component {

    render() {
        const { onClose, variant, message, isOpen, onAcceptAudio, onAcceptVideo } = this.props;

        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isOpen}
                    autoHideDuration={(1000 * 45)}
                    onClose={onClose}
                >
                    <MySnackbarContentWrapper
                        onClose={onClose}
                        variant={variant}
                        message={message}
                        onAcceptAudio={onAcceptAudio}
                        onAcceptVideo={onAcceptVideo}
                    />
                </Snackbar>
            </div>
        );
    }
}

CallerSnackBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(CallerSnackBar);