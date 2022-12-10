import React, { Component } from 'react';
import { DRAWER_MENU_NAMES } from '../../utils/Constants';
import { menuList } from '../menu'

class Drawer extends Component {

  getDrawerClass = (menu) => {
    let { selectedMenu } = this.props;
    let className = 'drawerMainItem ';
    if (selectedMenu === menu) {
      className = className + 'drawerMainItem_selected'
    }
    return className;
  }

  render() {
    let menu = menuList();
    let { handleMenuClick } = this.props;

    var menuItems = menu.map((item) => (
      <div key={item.no} className={this.getDrawerClass(item.name)} onClick={() => handleMenuClick(item.no, item.name)}>
        <div className="drawerItemLabelDiv" >
          <label className="drawerItemLabel" >{item.name}</label>
        </div>
        <div className="drawerIconDiv" >
          <i className={item.icon} />
        </div>
      </div>
   ))

    return (
      <div className="drawer">
        {menuItems}
      </div>
    );
  }
}

export default Drawer;