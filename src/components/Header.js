import React from 'react';
import { Link, navigate } from "gatsby"
import Grid from '@material-ui/core/Grid';
import SearchBar from "material-ui-search-bar";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import '../styles/styles.css'


class Header extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            ticker: ""
        }
    }
    render(){
        const onSearch = () => {
            navigate(`/options/${this.state.ticker}`)
        }
        var onChange = (value) => {
            this.setState({ticker: value})
        }
        return(
            <AppBar position="static" id="header">
                <Toolbar>
                    <Link to="/options/TSLA" id="headerTitle">
                        <h3>Options Track</h3>
                    </Link>
                    <SearchBar
                        onChange={(e) => onChange(e)}
                        onRequestSearch={() => onSearch()}
                        id="searchBar"
                    />
                </Toolbar>

            </AppBar>
        )
    }
}

export default Header;