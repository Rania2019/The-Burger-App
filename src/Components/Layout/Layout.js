import React, {Component} from 'react';

import Auxiliary from '../../hoc/Auxiliary';
import './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
//import DrawerToggle from ''
class  Layout extends Component {
    state = {
        showSideDrawer: false
    }
    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggleHandler =() => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer};
        });
    }
    render () {
        return (
            <Auxiliary>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler} />
                <main className = "Content">
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

export default Layout;