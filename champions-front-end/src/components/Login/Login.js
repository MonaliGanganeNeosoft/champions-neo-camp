import React, { Component } from 'react';
import Loading from '../Common/Loading';
import { EMAIL_REGEX, customErrorMessages, MINLENGHT8_REGEX } from '../../utils/Validations';
import { SNACK_BAR_VARIANTS } from '../../utils/Constants';
import { USERDATA, AUTH_TOKEN } from '../../API/apiConstants';
import history from '../../routes/customhistory';
import { API } from '../../API/api';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


class Login extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      loadingText: "Loading ...",
      userRole: '',
      emailId: "",
      errorEmailId: "",
      forgotPassEmailError: "",
      password: "",
      errorPassword: "",
      name: "",
      userData: null,
      token: "",
      forgotPassEmail: "",
      open: false,
      logo: require('../../assests/images/Header/headerLogo.svg')
    }
  }

  componentDidMount() {
    this.props.hideHeader();
  }

  handleOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }

  handleValidation = () => {
      let { password, emailId } = this.state;
      let allOk = true;
      if (!emailId && !EMAIL_REGEX.test(emailId)) {
          let { valueMissing, patternMismatch } = customErrorMessages.email;
          allOk = false;
          this.setState({
              errorEmailId: emailId ? patternMismatch : valueMissing
          });
      }

      if (!password && !MINLENGHT8_REGEX.test(password)) {
          let { valueMissing, patternMismatch } = customErrorMessages.password;
          allOk = false;
          this.setState({
              errorPassword: password ? patternMismatch : valueMissing
          });
      }
      return allOk;
  }

  handleForgotPassValidation = () => {
    let { forgotPassEmail } = this.state;
    let allOk = true;
    if (!forgotPassEmail && !EMAIL_REGEX.test(forgotPassEmail)) {
        let { valueMissing, patternMismatch } = customErrorMessages.email;
        allOk = false;
        this.setState({
            forgotPassEmailError: forgotPassEmail ? patternMismatch : valueMissing
        });
      }

    return allOk;
}
  

  handleOpen = () => {
    this.setState({
      open: true
    })
   };
 
   handleClose = () => {
     this.setState({
       open: false
     })
   };

  handleLogin = e => {
    e.preventDefault();
    let { password, emailId } = this.state;
    this.setState({ isLoading: true });
    if(this.handleValidation()){
      API.userLogin(this.getAuthenticationCallback, {email: emailId, password: password});
    }
    else {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, "There was some problem, Please try again :(");
      this.setState({ isLoading: false });
    }
  }

  getAuthenticationCallback = {
    success: (response) => {
      localStorage.setItem(AUTH_TOKEN, JSON.stringify(response.token));
      this.setState({
        email: response.data.email,
        token: response.data.token,
        userRole: response.data.role,
        name: response.data.name,
        isLoading: false
      },()=>{
        let { password, emailId, userRole, name } = this.state;
      localStorage.setItem(USERDATA, JSON.stringify({ password, emailId, userRole, name}));
      this.props.setUser({ password, emailId, userRole, name });
      this.props.setToken({token: response.token});
      this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
        if (response.data.role == 'admin') {
          this.setState({ isLoading: false },()=> history.replace('/leads'));
        } else if (response.data.role == 'lead') {
          this.setState({ isLoading: false },()=> history.replace('/champions'));
        } else if (response.data.role == 'champion') {
          this.setState({ isLoading: false },()=> history.replace('/team'));
        }
      });
    },
    error: (error) => {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
      this.setState({
        isLoading: false
      })
    }
  }
  
  signUp = () => {
    this.props.history.push('/signUp')
  }

  handleForgotPassword = () => {
    if(this.handleForgotPassValidation()) {
      let { forgotPassEmail } = this.state;
      console.log(forgotPassEmail);
      API.forgotPassword(this.getForgotPasswordCallback,  {email: forgotPassEmail});
    }
  }

  getForgotPasswordCallback = {
    success: (response) => {
      this.setState({
        isLoading: false,
        open: false
      },()=>{
        this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
      });
    },
    error: (error) => {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
      console.log("error in getUserKeywords = ", error);
      this.setState({
        isLoading: false
      })
    }
  }

  _renderForgotPassword = () => {
    let { forgotPassEmail, open, forgotPassEmailError } = this.state;
    return (
        <div className="emailDialog">
          <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description" 
          >
            <DialogContent>
            <div className="emailFeilds" style={{width: 'auto'}}>
              <label> Email: </label>
              <input
                  type="text"
                  name="forgotPassEmail"
                  value={forgotPassEmail}
                  onChange={this.handleOnChange}
                  placeholder="Email"
                  style={{minWidth: '500px'}} />
                  <p className="error">{forgotPassEmailError}</p>
            </div> 
            </DialogContent>
            <DialogActions>
              <Button className="inputButton" onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button className="inputButton" onClick={this.handleForgotPassword} color="primary" autoFocus>
                Send Email
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    ) 
  }
 
  _renderLogin = () => {
    let { emailId, password, errorEmailId, errorPassword } = this.state;
    return (
      <div className='loginMainDiv'>
        <form onSubmit={this.handleLogin}>
          <div className="labelDiv">
            <label className="label">Email : </label>
          </div>
          <div className="inputDiv">
            <input
              type="email"
              name="emailId"
              value={emailId}
              onChange={this.handleOnChange}
              placeholder="Email" />
              <p className="error">{errorEmailId}</p>
          </div>

          <div className="labelDiv">
            <label className="label">Password : </label>
          </div>
          <div className="inputDiv">
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleOnChange}
              placeholder="Password" />
              <p className="error">{errorPassword}</p>
          </div>
          <div className="buttonContainer">
            <button type="submit" className="inputButton">Login</button>
            <button className="inputButton" onClick={this.signUp} >Sign Up</button>
          </div>
          <div className="hyperLinks">
            <a onClick={this.handleOpen}>Forgot Password</a>
          </div>
        </form>
      </div>
    )
  }

  render() {
    let { header, isLoading, loadingText } = this.state;
    return (
      <div className="login">
        <Loading isLoading={isLoading} label={loadingText} />
        <div className="headerDiv">
          <img className= "logoImage" src={this.state.logo}></img>
        </div>
        <div className="detailsMainDiv">
          {this._renderLogin()}
          {this._renderForgotPassword()}
        </div>
      </div>
    );
  }
}

export default Login;