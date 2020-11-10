import React from 'react';
import SearchBar from "material-ui-search-bar";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link, Redirect} from 'react-router-dom'
import '../styles/styles.css'
import { withRouter } from "react-router";

class Header extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            ticker: "",
            route: false
        }
    }
    render(){
        const onSearch = () => {
            this.setState({route: true})
        }
        var onChange = (value) => {
            this.setState({ticker: value})
        }
        if (this.state.route === true) {
            this.setState({route: false})
            return <Redirect to={'/options/'+this.state.ticker} />
        }
        return(
            <AppBar position="static" id="header">
                <Toolbar>
                    <Link to="/options/SPY" id="headerTitle">
                        <h3>OptionsTrack</h3>
                    </Link>
                    <SearchBar
                        onChange={(e) => onChange(e)}
                        onRequestSearch={() => onSearch()}
                        id="searchBar"
                        placeholder="Search Quote"
                    />
                </Toolbar>

            </AppBar>
        )
    }
}

export default Header;