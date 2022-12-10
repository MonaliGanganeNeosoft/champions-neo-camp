import React, {Component} from 'react';
import history from '../../routes/customhistory';
import Loading from '../Common/Loading';
import { API } from '../../API/api';
import { SNACK_BAR_VARIANTS } from '../../utils/Constants';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';


class Leads extends Component {
    constructor() {
        super() 
        this.state = {
            isLoading: false,
            loadingText: "Loading ...",
            header: "Welcome ",
            leadsList: [],
            open: false
        };
    }

    componentDidMount() {
        this.props.showHeader();
        let { userData } = this.props;
        if (userData) {
            let { name } = userData;
            this.getLeadList();
            this.setState({
              header: "Welcome " + name
            });
          }
          else {
            this.setState({ isLoading: false }, ()=> history.replace('/login'));
          }
    }

    getLeadList = () =>{
     API.getLeadList(this.getUserListCallback);
    }

    getUserListCallback = {
        success: (response) => {
        this.setState({
            leadsList: response.data.leads,
            isLoading: false
        },()=>{
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

    openDialog() {
        this.setState({ open: true });
    }

    closeDialoag() {
        this.setState({ open: false});
    }
    handleValidation = () => {
        let { movieName, releaseOn } = this.state;
        let allOk = true;
        if (!movieName) {
            allOk = false;
            this.setState({
                errormovieName: 'Please enter movie name' 
            });
        }
        if (!releaseOn) {
            allOk = false;
            this.setState({
                errorPassword: 'Please enter movie release date'
            });
        }
        return allOk;
    }

    handleSubmit = async() => {
        this.setState({ isLoading: true });
        if(this.handleValidation()){
          let { movieName, releaseOn } = this.state;
    
          API.addMovie(this.getAuthenticationCallback, {name: movieName, release_on: releaseOn});
        }
        else {
          this.props.showSnackBar(SNACK_BAR_VARIANTS.error, "There was some problem, Please try again :(");
          this.setState({ isLoading: false });
        }
      }

      getAuthenticationCallback = {
        success: (response) => {
            let data = {
                id: response.data._id,
                name: response.data.name,
                release_on: response.data.released_on
            };
            this.state.leadsList.push(data)
            this.setState({
                isLoading: false,
                open: false
              })
              
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

      handleOnChange = ({ target: { name, value } }) => {
        this.setState({
          [name]: value
        })
      }

      deleteMovie = (index) => {
        API.deleteLead(this.getAuthenticationCallbackDelete, this.state.leadsList[index].id);
      }

      getAuthenticationCallbackDelete = {
        success: (response) => {
          const i = this.state.leadsList.findIndex(item =>{
            return response.data._id == item.id
          });
          const { leadsList } = this.state;
          leadsList.splice(i, 1);
          this.setState({ leadsList });   
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

      editMovie = (index) => {
       this.props.updateLead({
          firstName: this.state.leadsList[index].firstName,
          lastName: this.state.leadsList[index].lastName,
          emailId: this.state.leadsList[index].email,
          location: this.state.leadsList[index].location,
          department: this.state.leadsList[index].department,
          id: this.state.leadsList[index].id
       });
       history.push('/leads/Add/#');
      }

      addLead = () => {
          this.props.updateLead({ });
          history.push('/leads/Add/#')
      }

    render() {
        let {isLoading, loadingText} = this.state;
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
                <div className="leadsMainDiv">
                    <div className="addButtonConatiner">
                      <Button className="inputButton" onClick={this.addLead.bind()}>Add Lead</Button> 
                    </div> 
                  
                    <div className="tabelContainer">
                        <Paper>
                            <Table aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell align="center">Email</StyledTableCell>
                                    <StyledTableCell align="center">Department</StyledTableCell>
                                    <StyledTableCell align="center">Location</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.leadsList.map((row, i) => (
                                    <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.firstName + ' ' + row.lastName} 
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                                    <StyledTableCell align="center">{row.department}</StyledTableCell>
                                    <StyledTableCell align="center">{row.location}</StyledTableCell>
                                    <StyledTableCell align="center">
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
                <Loading isLoading={isLoading} label={loadingText} />
            </div>
        );
    }
}

export default Leads;

