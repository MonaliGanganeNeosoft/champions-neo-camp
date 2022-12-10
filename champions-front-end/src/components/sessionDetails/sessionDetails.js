import React, {Component} from 'react';
import history from '../../routes/customhistory';
import Loading from '../Common/Loading';
import { API } from '../../API/api';
import { SNACK_BAR_VARIANTS } from '../../utils/Constants';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { EMAIL_REGEX } from '../../utils/Validations';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {ActionCreators} from '../../actions/index';


class SessionDetails extends Component {
    constructor() {
        super() 
        this.state = {
            isLoading: false,
            loadingText: "Loading ...",
            header: "Welcome ",
            leadList: [],
            voteOpen: false,
            title: '',
            selectedFile: null,
        };
    }

    componentDidMount() {
        this.props.showHeader();
        let { userData } = this.props;
        if (userData) {
            let { name } = userData;
            this.setState({
              header: "Welcome " + name
            });
          }
          else {
            this.setState({ isLoading: false }, ()=> history.replace('/login'));
          }
    }

      handleOnSelectChange = ({ target: { name, value } }) => {
        this.setState({
          [name]: value,
        }, () => {
        })
      }

      deleteMovie = (index) => {
        API.deleteChampion(this.getAuthenticationCallbackDelete, this.state.championList[index].id);
      }

      getAuthenticationCallbackDelete = {
        success: (response) => {
          const i = this.state.championList.findIndex(item =>{
            return response.data._id == item.id
          });
          const { championList } = this.state;
          championList.splice(i, 1);
          this.setState({ championList });   
          this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
        },
        error: (error) => {
          this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
          this.setState({
            isLoading: false,
            open: false
          })
        }
      }

      addLead = () => {
        this.setState({
            voteOpen: true
        })
      }

      showVoterComment = (index) => {
        this.setState({
          voterDetails: this.state.championList[index].voters
        }, () => {
          this.handleOpen();
        })
      }

      getChampionOfWeekCallback = {
        success: (response) => {
          this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
          this.setState({
            isLoading: false,
            voteOpen: false
          })
        },
        error: (error) => {
          this.props.showSnackBar(SNACK_BAR_VARIANTS.error, error.response.data.message);
          this.setState({
            isLoading: false,
            voteOpen: false
          })
        }
      }

      handleOpen = () => {
        this.setState({
          open: true
        })
       };
     
       handleClose = () => {
         this.setState({
           open: false,
           voteOpen: false
         })
       };
   
       addVote = (i) => {
        this.setState({
          voterInfo: this.state.championList[i],
          voteOpen: true
        }, () =>{
        })
      }

      handleFileUpload = () => {
        if(this.handleEmailValidation) {
            console.log(this.state.selectedFile)
            API.uploadSessionData(this.getUploadSessionDataCallback, {docTitle: this.state.title, emailId: this.props.userData.emailId, docs: this.state.selectedFile})
        }
      }
 
     getUploadSessionDataCallback = {
         success: (response) => {
         this.setState({
             isLoading: false
         },()=>{
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

      handleEmailValidation = () => {
        let { title } = this.state;
        let allOk = true;
        if (title) {
          allOk = true
        } else {
          allOk = false;
          this.props.showSnackBar(SNACK_BAR_VARIANTS.error, 'Please enter title');
        }
        return allOk;
      }

      handleOnChange = ({ target: { name, value } }) => {
        this.setState({
          [name]: value
        }, () => {
        })
      }

      handleFileChange = (e) => {
          // this.setState({ files: [...this.state.files, file] });
          this.setState({
            selectedFile: e.target.files[0]
          })
      }

      _renderAddChampion = () => {
        if (this.props.userData.userRole != 'admin') {
          return (  
            <div className="addButtonConatiner">
              <Button className="inputButton" onClick={this.addLead.bind()}>Add Session</Button> 
            </div> 
          )
        }
      }

      _renderVoteModel =() => {
        let {voteOpen, title, files} = this.state;
        return (
            <div className="emailDialog">
              <Dialog
                open={voteOpen}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" 
                fullScreen={false}
              >
                {/* <DialogTitle id="alert-dialog-title">{"Please compose Email for champion" + ' ' + this.state.voterInfo.firstName + ' '  + this.state.voterInfo.lastName + " of the week"}</DialogTitle> */}
                <DialogContent>
                 <div className="emailFeilds">
                   <label> Title: </label>
                   <input
                       type="text"
                       name="title"
                       value={title}
                       onChange={this.handleOnChange}
                       placeholder="Title" />
                 </div> 
                 <div className="emailFeilds">
                   <label> Upload file: </label>
                   <input
                       type="file"
                       name="files"
                       onChange={this.handleFileChange}
                       placeholder="file" />
                 </div>  
                </DialogContent>
                <DialogActions>
                  <Button className="inputButton" onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button className="inputButton" onClick={this.handleFileUpload} color="primary" autoFocus>
                    Send Email
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          );
      }

      _renderTabel = () => {
        if (this.state.championList && this.state.championList.length) {
          const StyledTableCell = withStyles(theme => ({
            head: {
              backgroundColor: theme.palette.common.black,
              color: theme.palette.common.white,
            },
            body: {
              fontSize: 14,
            },
          }))(TableCell);
          
          const StyledTableRow = withStyles(theme => ({
            root: {
              '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
              },
              '&:nth-of-type(even)': {
                backgroundColor: theme.palette.background.default,
              },
            },
          }))(TableRow);
          return (
            <div>
              
            <div className="tabelContainer">
                <Paper>
                    <Table aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="left">Email</StyledTableCell>
                            <StyledTableCell align="left">Department</StyledTableCell>
                            <StyledTableCell align="left">Location</StyledTableCell>
                            <StyledTableCell align="left">Votes</StyledTableCell>
                            {(this.props.userData.userRole === 'lead' && this.state.currentDay === 'Friday') &&
                          <StyledTableCell align="left">Select Champ</StyledTableCell>}
                            <StyledTableCell align="left">Action</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.championList.map((row, i) => (
                            <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                {row.firstName + ' ' + row.lastName} 
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.email}</StyledTableCell>
                            <StyledTableCell align="left">{row.department}</StyledTableCell>
                            <StyledTableCell align="left">{row.location}</StyledTableCell>
                            <StyledTableCell align="left"><a className="hyperLinks" onClick={this.showVoterComment.bind(this, i)}>{row.voteCount}</a></StyledTableCell>
                           {(this.props.userData.userRole === 'lead' && this.state.currentDay === 'Friday') &&  <StyledTableCell align="left">
                                  <button className="inputButton" key={row.id} onClick={this.addVote.bind(this, i)}>Champion</button>
                            </StyledTableCell>}
                            <StyledTableCell align="left">
                              <button className="inputButton tableActionButtons" key={row.id} onClick={this.deleteMovie.bind(this, i)}><i className="fa fa-trash"></i></button>
                              <button className="inputButton tableActionButtons" key={row.name} onClick={this.editMovie.bind(this, i)}><i className="fa fa-edit"></i></button>
                            </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
          </div>
          )
        } else {
          return (
            <div className="leadsMainDiv">
              <div className="noData">
                <h4>No data available</h4>
              </div>
            </div>
          )
        }
      }

    _renderTableByRole = () => {
      // let {selectedLead} = this.state;
      if (this.props.userData.userRole == 'admin') {
        return (
          <div>
              <div className="noData">
                <select defaultValue={'default'} name="selectedLead" onChange={this.handleOnSelectChange}>
                <option  value="default" disabled>Select lead</option>
                {this.state.leadList.map(row =>
                  <option key={row.id} value={row.email}>{row.firstName + ' ' + row.lastName}</option>
                )};
              </select>
              </div>
              {this._renderTabel()}
          </div>
        )
      } else {
        return (
           this._renderTabel()
        )
      }
    }    

    render() {
      let {isLoading, loadingText} = this.state;
        return ( 
          <div className="leadsMainDiv">
              {this._renderAddChampion()}
              {this._renderTableByRole()}
              {this._renderVoteModel()}
              <Loading isLoading={isLoading} label={loadingText} />
          </div>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userData : state.userData
    }
  }
  
  const mapDispatchToProps = dispatch => {
    let {setUser} = ActionCreators;
    return bindActionCreators({setUser}, dispatch);
  }
  
  const SessionDetailsActionConatiner = connect(
    mapStateToProps,
    mapDispatchToProps
  )(SessionDetails);
  
  export default SessionDetailsActionConatiner;
  

