import React from 'react';
import Divider from '@material-ui/core/Divider';
import { Link, navigate } from "gatsby"
import Grid from '@material-ui/core/Grid';
import SearchBar from "material-ui-search-bar";
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
            <div>
                <div id="header">
                    <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={4}>
                        <Grid item>
                            <Link to="/" id="headerTitle">
                                <h1>Options Track</h1>
                            </Link>
                        </Grid>
                        <Grid item>
                            <SearchBar
                                onChange={(e) => onChange(e)}
                                onRequestSearch={() => onSearch()}
                                id="searchBar"
                            />
                        </Grid>
                    </Grid>
                </div>                
                <Divider/>
            </div>
        )
    }
}

export default Header;