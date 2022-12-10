import React, { Component } from 'react';
import Loading from '../Common/Loading';
import { EMAIL_REGEX, customErrorMessages, MINLENGHT8_REGEX } from '../../utils/Validations';
import { SNACK_BAR_VARIANTS } from '../../utils/Constants';
import history from '../../routes/customhistory';
import { API } from '../../API/api';



class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      loadingText: "Loading ...",
      header: "Sign Up",
      userRole: 'lead',
      emailId: "",
      errorEmailId: "",
      password: "",
      confirmPassword: "",
      errorPassword: "",
      errorConfirmPassword: "",
      errorUserRole: "",
      name: "",
      userData: null,
      token: "",
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
      let { password, emailId, confirmPassword, userRole } = this.state;
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

      if (!confirmPassword && !MINLENGHT8_REGEX.test(confirmPassword)) {
        let { valueMissing, patternMismatch } = customErrorMessages.password;
        allOk = false;
        this.setState({
            errorConfirmPassword: confirmPassword ? patternMismatch : valueMissing
        });
      }

      if (confirmPassword !== password ) {
        allOk = false;
        this.setState({
            errorConfirmPassword: "Password dosent match"
      });
     }

      if (!userRole ) {
        allOk = false;
        this.setState({
            errorConfirmPassword: "Please select user role"
      });  
    }

        return allOk;
  }

  handleLogin = async() => {
    this.setState({ isLoading: true });
    if(this.handleValidation()){
      let { password, emailId, userRole } = this.state;
      API.userSignUp(this.getAuthenticationCallback, {email: emailId, password: password, userRole: userRole});
    }
    else {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, "There was some problem, Please try again :(");
      this.setState({ isLoading: false });
    }
  }

  getAuthenticationCallback = {
    success: (response) => {
      this.setState({
        isLoading: false
      },()=>{
      this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
      this.setState({ isLoading: false },()=> history.replace('/login'));
      });
    },
    error: (error) => {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
      this.setState({
        isLoading: false
      })
    }
  }
  
  logIn = () => {
    this.props.history.push('/login')
  }

  _renderLogin = () => {
    let { emailId, password, userRole, errorEmailId, errorPassword, confirmPassword, errorConfirmPassword, errorUserRole } = this.state;
    return (
      <div className='loginMainDiv'>
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
          <label className="label">New Password : </label>
        </div>
        <div className="inputDiv">
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleOnChange}
            placeholder="New Password" />
            <p className="error">{errorPassword}</p>
        </div>

        <div className="labelDiv">
          <label className="label">Confirm Password : </label>
        </div>
        <div className="inputDiv">
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={this.handleOnChange}
            placeholder="Confirm Password" />
            <p className="error">{errorConfirmPassword}</p>
        </div> 
        
        <div className="labelDiv">
          <label className="label">Please select role : </label>
        </div>
        <div className="inputDiv">
          <select className="selectInput" name="userRole" value={userRole} onChange={this.handleOnChange}>
            <option value="lead">Lead</option>
            <option value="champion">Champion</option>
          </select>
          <p className="error">{errorUserRole}</p>
        </div> 

        <div className="buttonContainer">
          <button className="inputButton" onClick={this.handleLogin} >Sign Up</button>
          <button className="inputButton" onClick={this.logIn} >Log In</button>
        </div>
      </div>
    )
  }

  render() {
    let { header, isLoading, loadingText } = this.state;
    return (
      <div className="login signUp">
        <Loading isLoading={isLoading} label={loadingText} />
        <div className="headerDiv">
          <img className= "logoImage" src={this.state.logo}></img>
        </div>
        <div className="detailsMainDiv">
          {this._renderLogin()}
        </div>
      </div>
    );
  }
}

export default SignUp;