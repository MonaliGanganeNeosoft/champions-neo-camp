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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {ActionCreators} from '../../actions/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import EmailEditor from 'react-email-editor';



class ChampionOfTheWeek extends Component {
    constructor() {
        super() 
        this.state = {
            isLoading: false,
            loadingText: "Loading ...",
            header: "Welcome ",
            championOfTheWeek: [],
            open: false,
            currentDay: '',
            voteReason: '',
            voterInfo: {},
        };
    }

    componentDidMount() {
        this.props.showHeader();
        let { userData } = this.props;
        if (userData) {
            let { name } = userData;
            var today = new Date();
            var day = today.getDay();
            var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
            this.setState({
              header: "Welcome " + name,
              currentDay: daylist[day]
            }, () => {
              this.getChamionOfWeekList();
            });
          }
          else {
            this.setState({ isLoading: false }, ()=> history.replace('/login'));
          }
    }

    getChamionOfWeekList = () =>{
      API.getChampionOfWeek(this.getChamionOfWeekCallback, {leadEmail: this.props.userData.emailId});
     }
 
     getChamionOfWeekCallback = {
         success: (response) => {
         this.setState({
            championOfTheWeek: response.data,
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

     addVote = (i) => {
       this.setState({
         voterInfo: this.state.championOfTheWeek[i]
       }, () =>{
        this.handleOpen();
       })
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

    handleWinner = () => {
      this.editor.exportHtml(data => {
        const { design, html } = data;
        let date =  new Date(new Date(this.state.voterInfo.date).getFullYear(),new Date(this.state.voterInfo.date).getMonth() , new Date(this.state.voterInfo.date).getDate())
        console.log()
        API.updateChampionOfWeek(this.updateChampionOfWeekCallback, {status: true, weekDate: date, htmlContent: html}, this.state.voterInfo._id);
      })
    }

    updateChampionOfWeekCallback = {
      success: (response) => {
      this.setState({
          open:false,
          isLoading: false
      },()=>{
        this.props.showSnackBar(SNACK_BAR_VARIANTS.success, "Winner declared successfully!!!");
        this.state.voterInfo.status = true;
      });
      },
      error: (error) => {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.error, "There was some problem getting users list :(");
      console.log("error in getUserKeywords = ", error);
      this.setState({
          isLoading: false
      })
      }
    }

    voteOnChange = ({ target: { name, value } }) => {
      this.setState({
        [name]: value
      })
    }

    weekAndDay(date) {
          let weekDay =  new Date(date)  
          var  prefixes = ['1st', '2nd', '3rd', '4th', '5th'];
          const month = weekDay.toLocaleString('default', { month: 'long' });
          return prefixes[Math.floor(weekDay.getDate() / 7)] + ' Week Of ' + month + ' ' + weekDay.getFullYear();
     
    }


     _renderVoteModel =() => {
       let {open} = this.state;
       if (this.state.voterInfo && this.state.voterInfo.champId) {
        return (
          <div className="emailDialog">
            <Dialog
              open={open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description" 
              fullScreen={true}
            >
              <DialogTitle id="alert-dialog-title">{"Please compose Email for champion" + ' ' + this.state.voterInfo.champId.firstName + ' '  + this.state.voterInfo.champId.lastName + " of the week"}</DialogTitle>
              <DialogContent>
              <EmailEditor
                ref={editor => this.editor = editor}
              />
              </DialogContent>
              <DialogActions>
                <Button className="inputButton" onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button className="inputButton" onClick={this.handleWinner} color="primary" autoFocus>
                  Send Email
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
       }
     }
  

      _renderTabel = () => {
        if (this.state.championOfTheWeek && this.state.championOfTheWeek.length) {
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
            <div className="leadsMainDiv">
               <div className="noData">
                      <h4>Champions</h4> 
                </div> 
            <div className="tabelContainer">
                <Paper>
                    <Table aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="center">Email</StyledTableCell>
                            <StyledTableCell align="center">Vote Count</StyledTableCell>
                            <StyledTableCell align="center">Week of month</StyledTableCell>
                            {this.props.userData.userRole == 'lead' && 
                            <StyledTableCell align="center">Action</StyledTableCell>}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.championOfTheWeek.map((row, i) => (
                            <StyledTableRow key={row._id}>
                            <StyledTableCell component="th" scope="row">
                                {row.champId.firstName + ' ' + row.champId.lastName} 
                            </StyledTableCell>
                            <StyledTableCell align="center">{row.champId.email}</StyledTableCell>
                            <StyledTableCell align="center">{row.voteCount}</StyledTableCell>
                            <StyledTableCell align="center">{this.weekAndDay(row.weekDate)}</StyledTableCell>
                            { (!row.status && this.props.userData.userRole == 'lead') &&
                              <StyledTableCell align="center">
                              <button className="inputButton" key={row.id} onClick={this.addVote.bind(this, i)}>Champion</button>
                            </StyledTableCell>
                            }
                            { (row.status && this.props.userData.userRole == 'lead') &&
                              <StyledTableCell align="center">
                                  Winner
                            </StyledTableCell>
                            }
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
  

    render() {
      let {isLoading, loadingText} = this.state;
        return ( 
          <div className="leadsMainDiv">
              {this._renderTabel()}
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

const ChampionOfTheWeekActionConatiner = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChampionOfTheWeek);

export default ChampionOfTheWeekActionConatiner;


