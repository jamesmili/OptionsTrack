import React from 'react';
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { navigate } from "gatsby"
import greeks from '../greeks/greeks';
import { proxyURL, quoteURL } from '../constants/const'

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
            greeks: [],
            tableData1: [],
            tableData2: []
        }
    }
    componentDidMount(){
        axios.get(proxyURL + quoteURL + this.props.contract, {
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
                tableData1: [
                    {id: "Ask:", value: this.state.data.quote.ask},
                    {id: "Bid:", value: this.state.data.quote.bid},
                    {id: "Open:", value: this.state.data.quote.regularMarketOpen},
                    {id: "High:", value: this.state.data.quote.regularMarketDayHigh},
                    {id: "Low:", value: this.state.data.quote.regularMarketDayLow},
                ],
                tableData2: [
                    {id: "Change:", value: Number(this.state.data.quote.regularMarketChange).toFixed(2)},
                    {id: "Change %:", value: Number(this.state.data.quote.regularMarketChangePercent).toFixed(2)},
                    {id: "Range:", value: this.state.data.quote.regularMarketDayRange},
                    {id: "Volume:", value: this.state.data.quote.regularMarketVolume},
                    {id: "Open Interest:", value: this.state.data.quote.openInterest},
                ]
            })
        }).catch(error =>{
            navigate(`/400`)
        })
        axios.get(proxyURL + quoteURL + this.props.ticker, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var obj = response.data.optionChain.result[0].options[0].calls.find(o => o.contractSymbol === this.props.contract)
            if (obj === undefined){
                obj = response.data.optionChain.result[0].options[0].puts.find(o => o.contractSymbol === this.props.contract)
            }
            var x = greeks(obj, true, obj.expiration, response.data.optionChain.result[0].quote.regularMarketPrice)
            var greek = [
                {id: "Delta:", value: x[0]},
                {id: "Gamma:", value: x[1]},
                {id: "Theta:", value: x[2]},
                {id: "Rho:", value: x[3]},
                {id: "Vega:", value: x[4]},
            ]
            this.setState({
                greeks: greek
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
                    <Grid container
                        direction="row"
                        justify="space-around"
                        alignItems="center"
                        spacing={5}
                    >
                        <Grid item>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            {this.state.tableData1.map((row) =>{
                                                return(
                                                    <TableRow key={row.id}>
                                                        <TableCell component="th" align="left" scope="row">
                                                            {row.id}
                                                        </TableCell>
                                                        <TableCell style={{ width: "15vw" }} align="right">
                                                            {row.value}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            {this.state.tableData2.map((row) =>{
                                                return(
                                                    <TableRow key={row.id}>
                                                        <TableCell component="th" align="left" scope="row">
                                                            {row.id}
                                                        </TableCell>
                                                        <TableCell style={{ width: "15vw" }} align="right">
                                                            {row.value}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            {this.state.greeks.map((row) =>{
                                                return(
                                                    <TableRow key={row.id}>
                                                        <TableCell component="th" align="left" scope="row">
                                                            {row.id}
                                                        </TableCell>
                                                        <TableCell style={{ width: "15vw" }} align="right">
                                                            {row.value}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default ContractInfo