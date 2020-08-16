import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

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
        return(
            <div>
                <Button onClick={() => {this.setState( {flag: true})}}>Calls</Button>
                <Button onClick={() => {this.setState( {flag: false})}}>Puts</Button>
                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Strike</TableCell>
                                <TableCell>Last Price</TableCell>
                                <TableCell>Bid</TableCell>
                                <TableCell>Ask</TableCell>
                                <TableCell>Change</TableCell>
                                <TableCell>Volume</TableCell>
                                <TableCell>Open Interest</TableCell>
                                <TableCell>Implied Volatility</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { this.state.flag ?
                            calls.map(o => (
                                    <TableRow key={o.contractSymbol}>
                                        <TableCell>{o.strike}</TableCell>
                                        <TableCell>{o.lastPrice}</TableCell>
                                        <TableCell>{o.bid}</TableCell>
                                        <TableCell>{o.ask}</TableCell>
                                        <TableCell>{Number(o.change).toFixed(2)}</TableCell>
                                        <TableCell>{o.volume}</TableCell>
                                        <TableCell>{o.openInterest}</TableCell>
                                        <TableCell>{Number(o.impliedVolatility*100).toFixed(2)}%</TableCell>
                                    </TableRow>
                            )) :
                            puts.map(o => (
                                <TableRow key={o.contractSymbol}>
                                    <TableCell>{o.strike}</TableCell>
                                    <TableCell>{o.lastPrice}</TableCell>
                                    <TableCell>{o.bid}</TableCell>
                                    <TableCell>{o.ask}</TableCell>
                                    <TableCell>{Number(o.change).toFixed(2)}</TableCell>
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