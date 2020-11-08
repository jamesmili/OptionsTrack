import React from 'react'
import axios from "axios";
import { proxyURL, chartURL, month } from '../constants/const';
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from 'recharts';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import QuoteInfo from './QuoteInfo';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from "@material-ui/core/styles";
import MuiTableCell from "@material-ui/core/TableCell";
import { connect } from 'react-redux';
import { period, interval, quoteToggle } from '../state/app';

const TableCell = withStyles({
    root: {
      borderBottom: "none"
    }
  })(MuiTableCell);

class Quote extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            meta: null,
            timestamp: [],
            quote: [],
            data: [],
            symbol: null,
            toggle: "1d",
            high: 999999,
            low: 0,
        }
        this.convertDate = this.convertDate.bind(this)
        this.tooltip = this.tooltip.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentDidMount(){
        this.getData(this.props.p, this.props.i)
        this.setState({
            loading: false
        })
    }

    componentDidUpdate(){
        if (this.props.ticker !== this.state.symbol){
            this.getData(this.props.p, this.props.i)
        }
    }

    getData(period, interval){
        var p1
        var day = new Date(period*1000).getDay()
        //weekend
        if (day === 0 || day === 6){
            p1 = "?"
        }else{
            p1 = "?period1=" + period + "&"
        }
        axios.get(proxyURL + chartURL + this.props.ticker + p1 + "&period2=9999999999&interval=" + interval, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var prevPrice = 0.00
            var p = 0.00
            var h = -99999999999
            var l = 999999999999
            this.setState({
                meta: response.data.chart.result[0].meta,
                timestamp: response.data.chart.result[0].timestamp.map((d) => {
                    return this.convertDate(d)
                }),
                quote: response.data.chart.result[0].indicators.quote,
                price: Number(response.data.chart.result[0].meta.regularMarketPrice).toFixed(2),
                symbol: response.data.chart.result[0].meta.symbol,
                flag: this.props.q
            })
            this.setState({
                date: this.state.timestamp[this.state.timestamp.length - 1],
                data:this.state.timestamp.map((t,index) => {
                    if (!response.data.chart.result[0].indicators.quote[0].close[index]){
                        if (index > 0){
                            p = prevPrice
                        }
                    }else{
                        p = Number(response.data.chart.result[0].indicators.quote[0].close[index].toFixed(2))
                        prevPrice = p
                        if (p < l){
                            l = p
                        }else if (h < p){
                            h = p
                        }
                    }
                    return {
                        Date: t,
                        Price: p
                    }
                })
            })
            this.setState({
                high: h,
                low: l
            })
        }).catch(error =>{
            console.log(error)
            this.setState({
                data: []
            })
        })
    }

    convertDate(epoch){
        const date = new Date(epoch*1000)
        var expr
        if (this.state.toggle === "1d"){
            expr = date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'} ) + " " + date.toLocaleTimeString('en-US')
        }else{
            expr = date.toLocaleDateString(undefined,  {year: 'numeric', month: 'short', day: 'numeric'})
        }
        return expr
    }
    
    tooltip({ active, payload }){
        
        if (active) {
            return(
                <Paper id="tooltip">
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableRow key={payload[0].payload.Date}>
                                        <TableCell component="th" scope="row">
                                            <b>Date:</b>
                                        </TableCell>
                                        <TableCell>
                                            {payload[0].payload.Date}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={payload[0].payload.Price}>
                                        <TableCell component="th" scope="row">
                                            <b>Price:</b>
                                        </TableCell>
                                        <TableCell>
                                            ${payload[0].payload.Price}
                                        </TableCell>
                                    </TableRow>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )
        }
        return null
    }

    render(){
        const chart = (
            <ResponsiveContainer width="99%" height={400}>
                <LineChart data={this.state.data} onMouseMove={this.hover}>
                    <YAxis tick={false} domain={[this.state.low, this.state.high]} hide/>
                    <Tooltip content={this.tooltip}/>
                    <Line type='monotone' dataKey='Price' stroke='#8884d8' strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
        const handleButton = (event, flag) => {
            var period, interval
            switch(flag){
                case "1d":
                    period = new Date().setHours(0,0,0,0)/1000 - 60*60*24
                    interval = "2m"
                    break;
                case "5d":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*5
                    interval = "15m"
                    break;
                case "1m":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*31
                    interval = "1h"
                    break;
                case "6m":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*183
                    interval = "1d"
                    break;
                case "1y":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*365
                    interval = "1d"
                    break;
                case "Max":
                    period = 0
                    interval = "5d"
                    break;
                default:
                    period = new Date().setHours(0,0,0,0)/1000 - 60*60*24
                    interval = "2m"
                    break;
            }
            this.setState({
                toggle: flag,
            })
            this.getData(period,interval)
            this.props.quoteToggle(flag)
            this.props.interval(interval)
            this.props.period(period)
        }
        return(
            <div className="tabs">
                {
                    this.state.loading ? 
                    <div id="loadingContainer">
                        <CircularProgress color='inherit'/> 
                    </div>
                :
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="flex-start"
                        spacing={4}
                        >
                        <Grid item id="chart" xs={12}> 
                            <Grid container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={8}>
                                <Grid item>
                                    <ToggleButtonGroup
                                    size="medium"
                                    value={this.props.q}
                                    exclusive
                                    onChange={handleButton}>
                                        <ToggleButton value="1d">
                                            1d
                                        </ToggleButton>
                                        <ToggleButton value="5d">
                                            5d
                                        </ToggleButton>
                                        <ToggleButton value="1m">
                                            1m
                                        </ToggleButton>
                                        <ToggleButton value="6m">
                                            6m
                                        </ToggleButton>
                                        <ToggleButton value="1y">
                                            1y
                                        </ToggleButton>
                                        <ToggleButton value="Max">
                                            Max
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={12} className="list">
                                    {chart}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <QuoteInfo ticker={this.props.ticker}/>
                        </Grid>
                    </Grid>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        p: state.app.period,
        i: state.app.interval,
        q: state.app.quoteToggle
    }
}

const mapActionsToProps = dispatch => ({
    period: (p) => dispatch(period(p)),
    interval: (i) => dispatch(interval(i)),
    quoteToggle: (q) => dispatch(quoteToggle(q))
});

export default connect(mapStateToProps, mapActionsToProps) (Quote);