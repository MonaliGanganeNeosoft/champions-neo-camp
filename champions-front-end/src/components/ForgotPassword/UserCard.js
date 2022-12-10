import React, { Component } from 'react';

class UserCard extends Component {
  render() {
    let { username, name, email, phone, website, photo } = this.props.user;
    let intials = '-';
    intials = name ? name.trim().charAt(0) : '-';
    let nameArr = name.split(' ');
    if(nameArr && nameArr[1]){
        intials = intials + nameArr[1].charAt(0);
    }
    return (
      <div className="userCard">
        <div className="photoMainDiv">
            {
                photo ? 
                    <img src={photo} className="photo" alt="DP" />
                    :
                    <p className="intialsText" >{intials}</p>
            }
        </div>
        <div className="detailsMainDiv">
            <h4 className="userName" >{username}</h4>
            <p className="otherDetails" >{name}</p>
            <p className="otherDetails" >{email}</p>
            <p className="otherDetails" >{phone}</p>
            <a className="otherDetails" href={website} target="_blank" >Visit Website</a>
        </div>
      </div>
    );
  }

}

export default UserCard;