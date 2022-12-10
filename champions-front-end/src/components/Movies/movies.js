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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import EmailEditor from "react-email-editor";
import { EMAIL_REGEX } from "../../utils/Validations";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class Movies extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      loadingText: "Loading ...",
      header: "Welcome ",
      championList: [],
      leadList: [],
      selectedLead: "",
      open: false,
      voteOpen: false,
      voterDetails: [],
      currentDay: "",
      voterInfo: {},
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      errorTo: "",
      editorContent: "",
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
      this.setState({
        header: "Welcome " + name,
        currentDay: daylist[4],
      });
    } else {
      this.setState({ isLoading: false }, () => history.replace("/login"));
    }

    if (userData.userRole == "admin") {
      this.getLeadList();
    } else if (userData.userRole == "lead") {
      this.setState(
        {
          selectedLead: userData.emailId,
        },
        () => {
          this.getMovieList();
        }
      );
    }
  }

  getLeadList = () => {
    API.getLeadList(this.getLeadListCallback);
  };

  getLeadListCallback = {
    success: (response) => {
      this.setState(
        {
          leadList: response.data.leads,
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

  getMovieList = () => {
    API.getChampionList(this.getUserListCallback, {
      leadEmail: this.state.selectedLead,
    });
  };

  getUserListCallback = {
    success: (response) => {
      this.setState(
        {
          championList: response.data.champions,
          isLoading: false,
        },
        () => {
          this.getChampionVoteCount();
        }
      );
    },
    error: (error) => {
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        error.response.data.message
      );
      this.setState({
        isLoading: false,
      });
    },
  };

  getChampionVoteCount = () => {
    console.log("on change");
    API.getVoteCount(this.getChampionVoteCallback, {
      leadEmail: this.state.selectedLead,
    });
  };

  getChampionVoteCallback = {
    success: (response) => {
      var champions = this.state.championList;
      champions.forEach((champ) => {
        var user = response.data.champions.find((voteInfo) => {
          return champ.email == voteInfo.championDetails.email;
        });
        user
          ? ((champ.voteCount = user.votingCount), (champ.voters = user.voters))
          : ((champ.voteCount = 0), (champ.voters = []));
      });

      champions.sort(function (a, b) {
        return b.voteCount - a.voteCount;
      });

      this.setState(
        {
          championList: champions,
        },
        () => {}
      );
    },
    error: (error) => {
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        "There was some problem getting users list :("
      );
      console.log("error in getUserKeywords = ", error);
      this.setState({
        isLoading: false,
      });
    },
  };

  handleOnSelectChange = ({ target: { name, value } }) => {
    this.setState(
      {
        [name]: value,
        championList: [],
      },
      () => {
        this.getMovieList();
      }
    );
  };

  deleteMovie = (index) => {
    API.deleteChampion(
      this.getAuthenticationCallbackDelete,
      this.state.championList[index].id
    );
  };

  getAuthenticationCallbackDelete = {
    success: (response) => {
      const i = this.state.championList.findIndex((item) => {
        return response.data._id == item.id;
      });
      const { championList } = this.state;
      championList.splice(i, 1);
      this.setState({ championList });
      this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
    },
    error: (error) => {
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        error.response.data.message
      );
      this.setState({
        isLoading: false,
        open: false,
      });
    },
  };

  editMovie = (index) => {
    this.props.updateChampion({
      firstName: this.state.championList[index].firstName,
      lastName: this.state.championList[index].lastName,
      emailId: this.state.championList[index].email,
      location: this.state.championList[index].location,
      department: this.state.championList[index].department,
      id: this.state.championList[index].id,
    });
    history.push("/champion/Add/#");
  };

  addLead = () => {
    this.props.updateChampion({});
    this.props.history.push("/champion/Add");
  };

  showVoterComment = (index) => {
    this.setState(
      {
        voterDetails: this.state.championList[index].voters,
      },
      () => {
        this.handleOpen();
      }
    );
  };

  getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  getChampionOfWeekCallback = {
    success: (response) => {
      this.props.showSnackBar(SNACK_BAR_VARIANTS.success, response.message);
      this.setState({
        isLoading: false,
        voteOpen: false,
      });
    },
    error: (error) => {
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        error.response.data.message
      );
      this.setState({
        isLoading: false,
        voteOpen: false,
      });
    },
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      voteOpen: false,
    });
  };

  addVote = (i) => {
    this.setState(
      {
        voterInfo: this.state.championList[i],
        voteOpen: true,
      },
      () => {}
    );
  };

  handleWinner = () => {
    console.log("", this.state.subject);
    this.handleEmailValidation();
    console.log(this.editor)
    // this.editor.exportHtml((data) => {
      // const { design, html } = data;   //changes
      let date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      );
      API.setChampionOfWeek(this.getChampionOfWeekCallback, {
        status: true,
        voteCount: this.state.voterInfo.voteCount,
        champId: this.state.voterInfo.id,
        weekDate: date.toString(),
        leadEmail: this.props.userData.emailId,
        htmlContent: this.state.editorContent,
        to: this.state.to,
        cc: this.state.cc,
        bcc: this.state.bcc,
        Subject: this.state.subject,
      // });
    });
  };

  handleEmailValidation = () => {
    let { to, cc, bcc, subject } = this.state;
    let allOk = true;
    if (to) {
      let toSeprated = to.split(",");
      for (let toEmailValue of toSeprated) {
        if (!EMAIL_REGEX.test(toEmailValue.trim())) {
          allOk = false;
          this.props.showSnackBar(
            SNACK_BAR_VARIANTS.error,
            "Please enter correct email id in To"
          );
        }
      }
    } else {
      allOk = false;
      this.props.showSnackBar(
        SNACK_BAR_VARIANTS.error,
        "Please specify at least one recipient"
      );
    }

    if (cc) {
      let ccSeprated = cc.split(",");
      for (let ccEmailValue of ccSeprated) {
        if (!EMAIL_REGEX.test(ccEmailValue.trim())) {
          allOk = false;
          this.props.showSnackBar(
            SNACK_BAR_VARIANTS.error,
            "Please enter correct email id in Cc"
          );
        }
      }
    }

    if (bcc) {
      let bccSeprated = bcc.split(",");
      for (let bccEmailValue of bccSeprated) {
        if (!EMAIL_REGEX.test(bccEmailValue.trim())) {
          allOk = false;
          this.props.showSnackBar(
            SNACK_BAR_VARIANTS.error,
            "Please enter correct email id in Bcc"
          );
        }
      }
    }

    if (subject) {
      if (!subject) {
        allOk = false;
        this.props.showSnackBar(
          SNACK_BAR_VARIANTS.error,
          "Please enter the subject"
        );
      }
    }
    return allOk;
  };

  handleOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  _renderAddChampion = () => {
    if (this.props.userData.userRole != "admin") {
      return (
        <div className='addButtonConatiner'>
          <Button className='inputButton' onClick={this.addLead.bind()}>
            Add Champion
          </Button>
        </div>
      );
    }
  };

  changeEditorHandler = (e, editor) => {
    this.setState({ editorContent: editor.getData() });
  };

  _renderVoteModel = () => {
    console.log(this.state.editorContent);
    let { voteOpen, to, cc, bcc, subject, errorTo } = this.state;
    if (this.state.voterInfo) {
      return (
        <div className='emailDialog'>
          <Dialog
            open={voteOpen}
            onClose={this.handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullScreen={true}
          >
            <DialogTitle id='alert-dialog-title'>
              {"Please compose Email for champion" +
                " " +
                this.state.voterInfo.firstName +
                " " +
                this.state.voterInfo.lastName +
                " of the week"}
            </DialogTitle>
            <DialogContent>
              <div className='emailFeilds'>
                <label> Subject: </label>
                <input
                  type='text'
                  name='subject'
                  value={subject}
                  onChange={this.handleOnChange}
                  placeholder='Subject'
                />
              </div>
              <div className='emailFeilds'>
                <label> To: </label>
                <input
                  type='text'
                  name='to'
                  value={to}
                  onChange={this.handleOnChange}
                  placeholder='To'
                />
              </div>
              <div className='emailFeilds'>
                <label> Cc: </label>
                <input
                  type='text'
                  name='cc'
                  value={cc}
                  onChange={this.handleOnChange}
                  placeholder='Cc'
                />
              </div>
              <div className='emailFeilds'>
                <label> Bcc: </label>
                <input
                  type='text'
                  name='bcc'
                  value={bcc}
                  onChange={this.handleOnChange}
                  placeholder='Bcc'
                />
              </div>
              {/* <EmailEditor
                 ref={editor => this.editor = editor}
               /> */}
              <div
                style={{
                  border: "1px solid black",
                  margin: "0px 30px 0px 30px",
                }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  onChange={this.changeEditorHandler}
                />
              </div>
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
                onClick={this.handleWinner}
                color='primary'
                autoFocus
              >
                Send Email
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  };

  _renderTabel = () => {
    if (this.state.championList && this.state.championList.length) {
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
        <div>
          <div className='tabelContainer'>
            <Paper>
              <Table aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align='left'>Email</StyledTableCell>
                    <StyledTableCell align='left'>Department</StyledTableCell>
                    <StyledTableCell align='left'>Location</StyledTableCell>
                    <StyledTableCell align='left'>Votes</StyledTableCell>
                    {this.props.userData.userRole === "lead" &&
                      (this.state.currentDay === "Friday" ||
                        this.state.currentDay === "Thursday") && (
                        <StyledTableCell align='left'>
                          Select Champ
                        </StyledTableCell>
                      )}
                    <StyledTableCell align='left'>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.championList.map((row, i) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component='th' scope='row'>
                        {row.firstName + " " + row.lastName}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        {row.department}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        {row.location}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <a
                          className='hyperLinks'
                          onClick={this.showVoterComment.bind(this, i)}
                        >
                          {row.voteCount}
                        </a>
                      </StyledTableCell>
                      {this.props.userData.userRole === "lead" &&
                        (this.state.currentDay === "Friday" ||
                          this.state.currentDay === "Thursday") && (
                          <StyledTableCell align='left'>
                            <button
                              className='inputButton'
                              key={row.id}
                              onClick={this.addVote.bind(this, i)}
                            >
                              Champion
                            </button>
                          </StyledTableCell>
                        )}
                      <StyledTableCell align='left'>
                        <button
                          className='inputButton tableActionButtons'
                          key={row.id}
                          onClick={this.deleteMovie.bind(this, i)}
                        >
                          <i className='fa fa-trash'></i>
                        </button>
                        <button
                          className='inputButton tableActionButtons'
                          key={row.name}
                          onClick={this.editMovie.bind(this, i)}
                        >
                          <i className='fa fa-edit'></i>
                        </button>
                      </StyledTableCell>
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

  _renderTableByRole = () => {
    // let {selectedLead} = this.state;
    if (this.props.userData.userRole == "admin") {
      return (
        <div>
          <div className='noData'>
            <select
              defaultValue={"default"}
              name='selectedLead'
              onChange={this.handleOnSelectChange}
            >
              <option value='default' disabled>
                Select lead
              </option>
              {this.state.leadList.map((row) => (
                <option key={row.id} value={row.email}>
                  {row.firstName + " " + row.lastName}
                </option>
              ))}
              ;
            </select>
          </div>
          {this._renderTabel()}
        </div>
      );
    } else {
      return this._renderTabel();
    }
  };

  _renderVotersDetailsModel = () => {
    if (this.state.voterDetails.length) {
      let { open } = this.state;
      return (
        <div>
          <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{"Voter Details"}</DialogTitle>
            <DialogContent>
              <ol>
                {this.state.voterDetails.map((voter, i) => (
                  <div style={{ minWidth: "500px" }} key={voter._id}>
                    <li>
                      <h5>
                        {voter.champId.firstName + " " + voter.champId.lastName}
                      </h5>
                      <p>{voter.voteDescription}</p>
                    </li>
                  </div>
                ))}
              </ol>
            </DialogContent>
            <DialogActions>
              <Button
                className='inputButton'
                onClick={this.handleClose}
                color='primary'
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  };

  render() {
    let { isLoading, loadingText } = this.state;
    return (
      <div className='leadsMainDiv'>
        {this._renderAddChampion()}
        {this._renderTableByRole()}
        {this._renderVotersDetailsModel()}
        {this._renderVoteModel()}
        <Loading isLoading={isLoading} label={loadingText} />
      </div>
    );
  }
}

export default Movies;
