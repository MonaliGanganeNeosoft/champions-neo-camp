import React, { Component } from "react";
import history from "../../routes/customhistory";
import Loading from "../Common/Loading";
import { API } from "../../API/api";
import { SNACK_BAR_VARIANTS } from "../../utils/Constants";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionCreators } from "../../actions/index";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

class ChampionVote extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      loadingText: "Loading ...",
      header: "Welcome ",
      teamList: [],
      open: false,
      currentDay: "",
      voteReason: "",
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
      var daylist = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday ",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      this.setState(
        {
          header: "Welcome " + name,
          currentDay: daylist[5],
        },
        () => {
          this.getTeamList();
        }
      );
    } else {
      this.setState({ isLoading: false }, () => history.replace("/login"));
    }
  }

  getTeamList = () => {
    API.getTeamList(this.getTeamListCallback, {
      email: this.props.userData.emailId,
    });
  };

  getTeamListCallback = {
    success: (response) => {
      this.setState(
        {
          teamList: response.data.champions,
          isLoading: false,
        },
        () => {}
      );
    },
    error: (error) => {
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        error.response.data.message
      );
      console.log("error in getUserKeywords = ", error);
      this.setState({
        isLoading: false,
      });
    },
  };

  addVote = (i) => {
    this.setState(
      {
        voterInfo: this.state.teamList[i],
      },
      () => {
        this.handleOpen();
      }
    );
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleVote = () => {
    let date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );
    // this.setState({
    //   voterInfo: {...this.state.voterInfo, ['voteReason']:this.state.voteReason, ['voterEmail']: this.props.userData.emailId, ['date']: date.toString()}
    // });
    this.state.voterInfo.voteReason = this.state.voteReason;
    this.state.voterInfo.voterEmail = this.props.userData.emailId;
    this.state.voterInfo.date = date.toString();
    API.takeVote(this.getVoteCallback, this.state.voterInfo);
  };

  getVoteCallback = {
    success: (response) => {
      this.setState(
        {
          open: false,
          isLoading: false,
        },
        () => {
          this.props.showSnackBar(
            SNACK_BAR_VARIANTS.success,
            "Thank you for nominating "
          );
        }
      );
    },
    error: (error) => {
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        error.response.data.message
      );
      console.log("error in getUserKeywords = ", error);
      this.setState({
        isLoading: false,
      });
    },
  };

  voteOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  _renderVoteModel = () => {
    let { open } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            {"Reason to nominate"}
          </DialogTitle>
          <DialogContent>
            <textarea
              style={{ minWidth: "500px" }}
              name='voteReason'
              value={this.voteReason}
              onChange={this.voteOnChange}
            ></textarea>
          </DialogContent>
          <DialogActions>
            <Button
              className='inputButton'
              onClick={this.handleClose}
              color='primary'
            >
              Cancel
            </Button>
            <Button
              className='inputButton'
              onClick={this.handleVote}
              color='primary'
              autoFocus
            >
              Nominate
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  _renderTabel = () => {
    if (this.state.teamList && this.state.teamList.length) {
      const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 14,
        },
      }))(TableCell);

      const StyledTableRow = withStyles((theme) => ({
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default,
          },
          "&:nth-of-type(even)": {
            backgroundColor: theme.palette.background.default,
          },
        },
      }))(TableRow);
      return (
        <div className='leadsMainDiv'>
          <div className='noData'>
            <h4>Champions</h4>
          </div>
          <div className='tabelContainer'>
            <Paper>
              <Table aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align='right'>Email</StyledTableCell>
                    <StyledTableCell align='right'>Department</StyledTableCell>
                    <StyledTableCell align='right'>Location</StyledTableCell>
                    {this.state.currentDay === "Friday" && (
                      <StyledTableCell align='right'>
                        Nominations
                      </StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.teamList.map((row, i) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component='th' scope='row'>
                        {row.firstName + " " + row.lastName}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {row.department}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {row.location}
                      </StyledTableCell>
                      {this.state.currentDay === "Friday" && (
                        <StyledTableCell align='right'>
                          <button
                            className='inputButton'
                            key={row.id}
                            onClick={this.addVote.bind(this, i)}
                          >
                            Nominate
                          </button>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      );
    } else {
      return (
        <div className='leadsMainDiv'>
          <div className='noData'>
            <h4>No data available</h4>
          </div>
        </div>
      );
    }
  };

  render() {
    let { isLoading, loadingText } = this.state;
    return (
      <div className='leadsMainDiv'>
        {this._renderTabel()}
        {this._renderVoteModel()}
        <Loading isLoading={isLoading} label={loadingText} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  let { setUser } = ActionCreators;
  return bindActionCreators({ setUser }, dispatch);
};

const ChampionVoteActionConatiner = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChampionVote);

export default ChampionVoteActionConatiner;
