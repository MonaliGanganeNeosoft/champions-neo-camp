import React, {Component} from 'react';
import history from '../../routes/customhistory';
import Loading from '../Common/Loading';
import { API } from '../../API/api';
import { SNACK_BAR_VARIANTS } from '../../utils/Constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {ActionCreators} from '../../actions/index';
import { EMAIL_REGEX, customErrorMessages, MINLENGHT8_REGEX, NAME_REGEX } from '../../utils/Validations';


class AddEditLeads extends Component {
    constructor() {
        super() 
        this.state = {
            isLoading: false,
            loadingText:'Loading...',
            firstName:'',
            lastName: '',
            emailId: '',
            department: '',
            location: '',
            errorEmailId: '',
            errorDepartment: '',
            errorLocation: '',
            errorLastName: '',
            errorFirstName: '',
            submitButton: 'Save',
            updateId: null
        };
    }

    componentDidMount() {
        this.props.showHeader();
        let { userData, leadData } = this.props;
        if (userData) {
            let { name } = userData;
            let { firstName, lastName, location, department, emailId, id} = leadData;
            if (leadData.emailId) {
            this.setState({
                header: "Welcome " + name,
                firstName: firstName,
                lastName: lastName,
                location: location,
                department: department,
                emailId: emailId,
                submitButton: 'Update',
                updateId: id
                });
            }
          }
          else {
            this.setState({ isLoading: false }, ()=> history.replace('/login'));
          }
    }

    handleOnChange = ({ target: { name, value } }) => {
        this.setState({
          [name]: value
        })
      }

      handleValidation = () => {
        let { firstName, lastName, emailId, department, location } = this.state;
        let allOk = true;
        if (!emailId && !EMAIL_REGEX.test(emailId)) {
            let { valueMissing, patternMismatch } = customErrorMessages.email;
            allOk = false;
            this.setState({
                errorEmailId: emailId ? patternMismatch : valueMissing
            });
        }
        if (!firstName && !NAME_REGEX.test(firstName)) {
            let { valueMissing, patternMismatch } = customErrorMessages.firstName;
            allOk = false;
            this.setState({
                errorFirstName: firstName ? patternMismatch : valueMissing
            });
        }

        if (!lastName && !NAME_REGEX.test(lastName)) {
            let { valueMissing, patternMismatch } = customErrorMessages.lastName;
            allOk = false;
            this.setState({
                errorLastName: lastName ? patternMismatch : valueMissing
            });
        }

        if (!department && !NAME_REGEX.test(department)) {
            let { valueMissing, patternMismatch } = customErrorMessages.department;
            allOk = false;
            this.setState({
                errorDepartment: department ? patternMismatch : valueMissing
            });
        }

        if (!location && !NAME_REGEX.test(location)) {
            let { valueMissing, patternMismatch } = customErrorMessages.location;
            allOk = false;
            this.setState({
                errorLocation: location ? patternMismatch : valueMissing
            });
        }
        return allOk;
    }

      handleSubmit = e => {
        e.preventDefault();
        this.setState({ isLoading: true });
        if(this.handleValidation()){
          let { firstName, lastName, location, emailId, department, updateId } = this.state;
          let {leadData} = this.props;
          if (leadData.emailId) {
            API.updateLead(this.getAuthenticationCallback, {firstName: firstName, lastName: lastName, department: department, location: location, email: emailId}, updateId);
          } else {
            API.addLead(this.getAuthenticationCallback, {firstName: firstName, lastName: lastName, department: department, location: location, email: emailId});
          }
        }
        else {
        //   this.props.showSnackBar(SNACK_BAR_VARIANTS.error, "There was some problem, Please try again :(");
          this.setState({ isLoading: false });
        }
      }
    
      getAuthenticationCallback = {
        success: (response) => {
          this.setState({
          },()=>{
          this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
          this.setState({ isLoading: false },()=> history.replace('/leads'));
          });
        },
        error: (error) => {
          this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
          this.setState({
            isLoading: false
          })
        }
      }

      cancel = () => {
          this.props.history.push('/leads');
      }
    
      _renderSaveButton = () => {
          
      }
    
      _renderForm = () => {
        let { emailId, firstName, lastName, department, location, errorDepartment, errorLocation, errorFirstName, errorLastName,  errorEmailId } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className='leadFormDiv'>
                    <div className="heading">Add Leads</div>
                    <div className="inputContainer"> 
                        <div className="labelDiv">
                            <label className="label">First Name : </label>
                        </div>
                        <div className="inputDiv">
                            <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={this.handleOnChange}
                            placeholder="Name" />
                            <p className="error">{errorFirstName}</p>
                        </div>
                    </div>

                    <div className="inputContainer"> 
                        <div className="labelDiv">
                            <label className="label">Last Name : </label>
                        </div>
                        <div className="inputDiv">
                            <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={this.handleOnChange}
                            placeholder="Name" />
                            <p className="error">{errorLastName}</p>
                        </div>
                    </div>
                    
                    <div className="inputContainer">
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
                    </div>

                    <div className="inputContainer">
                        <div className="labelDiv">
                            <label className="label">Department : </label>
                        </div>
                        <div className="inputDiv">
                            <input
                            type="text"
                            name="department"
                            value={department}
                            onChange={this.handleOnChange}
                            placeholder="Department" />
                            <p className="error">{errorDepartment}</p>
                        </div>
                    </div>

                    <div className="inputContainer">
                        <div className="labelDiv">
                            <label className="label">Location : </label>
                        </div>
                        <div className="inputDiv">
                            <input
                            type="text"
                            name="location"
                            value={location}
                            onChange={this.handleOnChange}
                            placeholder="Location" />
                            <p className="error">{errorLocation}</p>
                        </div>
                    </div>
            
                    <div className="buttonContainer formButtonCantainer">
                        <button type="submit" className="inputButton">{this.state.submitButton}</button>
                        <button className="inputButton" onClick={this.cancel} >Cancel</button>
                    </div>
                </div>
            </form>
        )
      }

    render() {
        let {isLoading, loadingText} = this.state;
        return ( 
            <div>
                <div className="leadsMainDiv">
                   {this._renderForm()}
                 </div>
                <Loading isLoading={isLoading} label={loadingText} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userData : state.userData,
        leadData : state.leadData
    }
}

const mapDispatchToProps = dispatch => {
    let {setUser, updateLead} = ActionCreators;
    return bindActionCreators({setUser, updateLead}, dispatch);
}

const LeadsActionConatiner = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditLeads);

export default LeadsActionConatiner;


