import React from 'react';
import axios from "axios";
import { proxyURL, quoteSumURL } from '../constants/const';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Grid from '@material-ui/core/Grid';

class QuoteInfo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            assetProfile: {},
            summaryDetail: [],
            earnings: {},
            currentEarnings: {}
        }
        this.getData = this.getData.bind(this)
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
        axios.get(proxyURL + quoteSumURL + this.props.ticker + "?modules=assetProfile%2CsummaryDetail%2Cearnings", {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var earningsVal
            var currentEarning
            if (response.data.quoteSummary.result[0].hasOwnProperty('earnings')){
                earningsVal = {
                        id: "Quarterly", 
                        value: response.data.quoteSummary.result[0].earnings.earningsChart.quarterly.map((val) => {
                            return(
                                {
                                    date: val.date,
                                    actual: val.actual.fmt,
                                    estimate: val.estimate.fmt
                                }
                            )
                        })
                    }
                currentEarning = {
                    quarter: response.data.quoteSummary.result[0].earnings.earningsChart.currentQuarterEstimateDate,
                    date: response.data.quoteSummary.result[0].earnings.earningsChart.earningsDate[0].fmt,
                    estimate: response.data.quoteSummary.result[0].earnings.earningsChart.currentQuarterEstimate.fmt
                }
            }else{
                earningsVal = {}
            }
            this.setState({
                assetProfile: {
                    id: "About",
                    value: response.data.quoteSummary.result[0].assetProfile.longBusinessSummary
                },
                summaryDetail: [
                    {id: "Open", value: response.data.quoteSummary.result[0].summaryDetail.open.fmt},
                    {id: "High", value: response.data.quoteSummary.result[0].summaryDetail.regularMarketDayHigh.fmt},
                    {id: "Low", value: response.data.quoteSummary.result[0].summaryDetail.regularMarketDayLow.fmt},
                    {id: "Volume", value: response.data.quoteSummary.result[0].summaryDetail.volume.fmt},
                    {id: "Market Cap", value: response.data.quoteSummary.result[0].summaryDetail.marketCap? response.data.quoteSummary.result[0].summaryDetail.marketCap.longFmt : "N/A"},
                ],
                earnings: earningsVal,
                currentEarnings: currentEarning
            })
        }).catch(error =>{
            console.log(error)
        })
    }

    render(){
        const summary = () => {
            return(
                this.state.summaryDetail.map((row) => {
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
                })
            )
        }
        const earnings = () => {
            return(
                this.state.earnings.value.map((row) => {
                    return(
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.date}
                            </TableCell>
                            <TableCell>
                                {row.actual}
                            </TableCell>
                            <TableCell>
                                {row.estimate}
                            </TableCell>
                        </TableRow>
                    )
                })
            )
        }
        const currentEarnings = () => {
            return(
                <TableRow>
                    <TableRow key={this.state.currentEarnings.quarter}>
                        <TableCell component="th" align="left" scope="row">
                            Quarter
                        </TableCell>
                        <TableCell style={{ width: "15vw" }} align="right">
                            {this.state.currentEarnings.quarter}
                        </TableCell>
                    </TableRow>
                    <TableRow key={this.state.currentEarnings.date}>
                        <TableCell component="th" align="left" scope="row">
                            Date
                        </TableCell>
                        <TableCell style={{ width: "15vw" }} align="right">
                            {this.state.currentEarnings.date}
                        </TableCell>
                    </TableRow>
                    <TableRow key={this.state.currentEarnings.estimate}>
                        <TableCell component="th" align="left" scope="row">
                            Estimate
                        </TableCell>
                        <TableCell style={{ width: "15vw" }} align="right">
                            {this.state.currentEarnings.estimate}
                        </TableCell>
                    </TableRow>
                </TableRow>
            )
        }
        return(
            <div>
                <div id="overview">
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-start"
                        >
                        <Grid item>
                            <h2>About</h2>
                            <p>{this.state.assetProfile.value}</p>                            
                        </Grid>
                        <Grid item>
                            <h2>Details</h2>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            {
                                                summary()
                                            }
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item>
                            <h2>Earnings</h2>
                            <TableContainer>
                                <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "7vw" }} >Date</TableCell>
                                        <TableCell style={{ width: "7vw" }} >Actual</TableCell>
                                        <TableCell style={{ width: "7vw" }} >Estimate</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                            {
                                                Object.keys(this.state.earnings).length > 0?
                                                earnings()
                                                :
                                                <p>N/A</p>
                                            }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item>
                            <h2>Upcoming Earnings</h2>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                            {
                                                Object.keys(this.state.earnings).length > 0?
                                                currentEarnings()
                                                :
                                                <TableRow> <p>N/A</p> </TableRow>
                                            }
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

export default QuoteInfo