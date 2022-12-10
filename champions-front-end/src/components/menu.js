import {store} from './../index'

export const menuList = () => {
  let state = store.getState();
  let menu = [];
  if (state.userData && state.userData.userRole == 'admin') {
    menu = [
          { 
            name: 'Leads',
            no: 1,
            selectedMenu: 'Leads',
            icon: 'fa fa-users drawerIcon'
          },
          { 
            name: 'Champions',
            no: 2,
            selectedMenu: '',
            icon: 'fa fa-users drawerIcon'
          }
        ];  
  } else if (state.userData && state.userData.userRole == 'lead'){
      menu = [
        { 
          name: 'Champions',
          no: 1,
          selectedMenu: 'Champions',
          icon: 'fa fa-users drawerIcon'
        },
        { 
          name: 'Team',
          no: 2,
          selectedMenu: 'Team',
          icon: 'fa fa-users drawerIcon'
        },
        { 
          name: 'Winners',
          no: 3,
          selectedMenu: '',
          icon: 'fa fa-users drawerIcon'
        }
      ];
  } else if (state.userData && state.userData.userRole == 'champion'){
    menu = [
      { 
        name: 'Team',
        no: 1,
        selectedMenu: 'Team',
        icon: 'fa fa-users drawerIcon'
      },
      {
        name: 'Sessions',
        no: 2,
        selectedMenu: '',
        icon: 'fa fa-users drawerIcon'
      }
      // { 
      //   name: 'Winners',
      //   no: 2,
      //   selectedMenu: '',
      //   icon: 'fa fa-users drawerIcon'
      // }
    ];
}
  return menu;
}