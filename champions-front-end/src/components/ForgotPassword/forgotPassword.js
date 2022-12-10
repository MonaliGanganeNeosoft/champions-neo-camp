import React, { Component } from 'react';
import Loading from '../Common/Loading';
import { API } from '../../API/api';
import { SNACK_BAR_VARIANTS } from '../../utils/Constants';
import { customErrorMessages, MINLENGHT8_REGEX } from '../../utils/Validations';
class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      loadingText: "Loading ...",
      logo: require('../../assests/images/Header/headerLogo.svg'),
      password: "",
      errorPassword: "",
      confirmPassword: "",
      errorConfirmPassword: "",
      token: "",
    }
  }

  componentDidMount() {
    this.props.hideHeader();
    const { token } = this.props.match.params
    this.setState({
      token: token
    })
  }

  handleForgotPassword = e => {
    e.preventDefault();
    this.handleValidation();
    console.log(this.state.token)
    let {password, token} = this.state;
    API.resetPassword(this.getForgotPasswordCallback, {password: password}, token);
  }

  getForgotPasswordCallback = {
    success: (response) => {
      this.setState({
        isLoading: false
      },()=>{
        this.props.showSnackBar(SNACK_BAR_VARIANTS.success, "Password reset successfully!!!");
        this.props.history.push('/login')
      });
    },
    error: (error) => {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
      this.setState({
        isLoading: false
      }, ()=> {
        this.props.history.push('/login')
      })
    }
  }

  handleOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }

  handleValidation = () => {
      let { password, confirmPassword } = this.state;
      let allOk = true;
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

      if (password !== confirmPassword) {
        allOk = false;
        this.setState({
          errorConfirmPassword: 'Password do not match'
        });
      }

      return allOk;
  }

  logIn = () => {
    this.props.history.push('/login')
  }

  _renderForgotPassword = () => {
    let {password, errorPassword, confirmPassword, errorConfirmPassword } = this.state;
    return (
      <div className='loginMainDiv'>
        <form onSubmit={this.handleForgotPassword}>
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
          <div className="buttonContainer">
            <button type="submit" className="inputButton">Save</button>
            <button className="inputButton" onClick={this.logIn}>Login</button>
          </div>
        </form>
      </div>
    )
  }

  render() {
    let { isLoading, loadingText } = this.state;
    return (
      <div className="login signUp">
      <Loading isLoading={isLoading} label={loadingText} />
      <div className="headerDiv">
        <img className= "logoImage" src={this.state.logo}></img>
      </div>
      <div className="detailsMainDiv">
        {this._renderForgotPassword()}
      </div>
    </div>
    );
  }

}

export default ForgotPassword;