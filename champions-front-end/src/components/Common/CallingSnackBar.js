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
    }
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, onAccept, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    Calling to &nbsp; {message}
                    <i className="fas fa-phone callingIcon animationShake" />
                </span>
            }
            action={[
                <Button variant="fab" color="primary" key= "callingDisconnect"
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

class CallingSnackBar extends React.Component {

    render() {
        const { onClose, variant, message, isOpen } = this.props;

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
                    />
                </Snackbar>
            </div>
        );
    }
}

CallingSnackBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(CallingSnackBar);