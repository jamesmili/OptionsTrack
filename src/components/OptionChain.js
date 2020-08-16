import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './styles.css';

class OptionChain extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            flag: true
        }
    }
    componentDidMount(){
        this.setState({flag: true})
    }
    render(){
        const calls = this.props.calls
        const puts = this.props.puts
        const change = (chge) => {
            const c = Number(chge).toFixed(2)
            if (c < 0){
                return(
                    <TableCell><div className="negative">{Number(c).toFixed(2)}</div></TableCell>
                )
            }else if (c > 0){
                return(
                    <TableCell><div className="positive">+{Number(c).toFixed(2)}</div></TableCell>
                )
            }else{
                return(
                    <TableCell>-</TableCell>
                )
            }
        }
        const changePercentage = (chge) => {
            const c = Number(chge).toFixed(2)
            if (c < 0){
                return(
                    <TableCell><div className="negative">{Number(c).toFixed(2)}%</div></TableCell>
                )
            }else if (c > 0){
                return(
                    <TableCell><div className="positive">+{Number(c).toFixed(2)}%</div></TableCell>
                )
            }else{
                return(
                    <TableCell>-</TableCell>
                )
            }
        }
        const inTheMoney = (strike, itm) => {
            if (itm){
                return(
                    <TableCell>
                        <Grid container spacing={3}
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        >
                            <div className="itm"></div>
                            <p className="strike">{strike}</p>
                        </Grid>
                    </TableCell>
                )                
            }
            else{
                return(
                    <TableCell>
                        <Grid container spacing={3}
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        >
                            <div className="otm"></div>
                            <p className="strike">{strike}</p>
                        </Grid>
                    </TableCell>
                )
            }
        }
        return(
            <div>
                <Button onClick={() => {this.setState( {flag: true})}}>Calls</Button>
                <Button onClick={() => {this.setState( {flag: false})}}>Puts</Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Strike</TableCell>
                                <TableCell>Last Price</TableCell>
                                <TableCell>Bid</TableCell>
                                <TableCell>Ask</TableCell>
                                <TableCell>Change</TableCell>
                                <TableCell>% Change</TableCell>
                                <TableCell>Volume</TableCell>
                                <TableCell>Open Interest</TableCell>
                                <TableCell>Implied Volatility</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { this.state.flag ?
                            calls.map(o => (
                                    <TableRow key={o.contractSymbol}>
                                        {inTheMoney(o.strike, o.inTheMoney)}
                                        <TableCell>{o.lastPrice}</TableCell>
                                        <TableCell>{o.bid}</TableCell>
                                        <TableCell>{o.ask}</TableCell>
                                        {change(o.change)}  
                                        {changePercentage(o.percentChange)}                         
                                        <TableCell>{o.volume}</TableCell>
                                        <TableCell>{o.openInterest}</TableCell>
                                        <TableCell>{Number(o.impliedVolatility*100).toFixed(2)}%</TableCell>
                                    </TableRow>
                            )) :
                            puts.map(o => (
                                <TableRow key={o.contractSymbol}>
                                    {inTheMoney(o.strike, o.inTheMoney)}
                                    <TableCell>{o.lastPrice}</TableCell>
                                    <TableCell>{o.bid}</TableCell>
                                    <TableCell>{o.ask}</TableCell>
                                    {change(o.change)}  
                                    {changePercentage(o.percentChange)}          
                                    <TableCell>{o.volume}</TableCell>
                                    <TableCell>{o.openInterest}</TableCell>
                                    <TableCell>{Number(o.impliedVolatility*100).toFixed(2)}%</TableCell>
                                </TableRow>
                            )) 
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

export default OptionChain