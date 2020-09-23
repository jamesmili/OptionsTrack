import React from 'react';
import axios from "axios";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import greeks from '../greeks/greeks';

const proxyURL = "https://nameless-mesa-82672.herokuapp.com/";
const endpointURL = "https://query2.finance.yahoo.com/v7/finance/options/"

class ContractInfo extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data: {
                quote: {
                    ask: 0.00,
                    bid: 0.00,
                    regularMarketOpen: 0.00,
                    regularMarketDayHigh: 0.00,
                    regularMarketDayLow: 0.00,
                    regularMarketDayRange: "0.00 - 0.00",
                    regularMarketVolume: 0,
                    openInterest: 0,
                }
            },
            tableData: []
        }
    }
    componentDidMount(){
        axios.get(proxyURL + endpointURL + this.props.contract, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({
                data: response.data.optionChain.result[0],
            })
            this.setState({
                tableData: [
                    {id: "Ask:", value: this.state.data.quote.ask},
                    {id: "Bid:", value: this.state.data.quote.bid},
                    {id: "Open:", value: this.state.data.quote.regularMarketOpen},
                    {id: "High:", value: this.state.data.quote.regularMarketDayHigh},
                    {id: "Low:", value: this.state.data.quote.regularMarketDayLow},
                    {id: "Range:", value: this.state.data.quote.regularMarketDayRange},
                    {id: "Volume:", value: this.state.data.quote.regularMarketVolume},
                    {id: "Open Interest:", value: this.state.data.quote.openInterest},
                ]
            })
        }).catch(error =>{
            console.log(error)
        })
    }
    render(){
        return(
            <div>
                <h1>Overview</h1>
                <div id="overview">
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    {this.state.tableData.map((row) =>{
                                        return(
                                            <TableRow key={row.id}>
                                                <TableCell component="th" align="left">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.value}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }
}

export default ContractInfo