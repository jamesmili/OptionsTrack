import React from 'react'
import Header from '../components/Header'
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import ContractInfo from '../components/ContractInfo';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';

const proxyURL = "https://nameless-mesa-82672.herokuapp.com/";
const endpointURL = "https://query1.finance.yahoo.com/v7/finance/chart/"
const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

class Contract extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            meta: null,
            timestamp: [],
            quote: [],
            data: [],
            price: 0.00,
            date: "",
            symbol: null,
            toggle: "1d",
        }
        this.hover = this.hover.bind(this)
        this.convertDate = this.convertDate.bind(this)
        this.tooltip = this.tooltip.bind(this)
        this.getData = this.getData.bind(this)
    }
    componentDidMount(){
        var period = new Date().setHours(0,0,0,0)/1000
        var interval = "2m"
        this.getData(period, interval)
        this.setState({
            loading: false
        })
    }

    getData(period, interval){
        axios.get(proxyURL + endpointURL + this.props.contract + "?period1=" + period + "&period2=9999999999&interval=" + interval, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var prevPrice = 0.00
            var p = 0.00
            this.setState({
                meta: response.data.chart.result[0].meta,
                timestamp: response.data.chart.result[0].timestamp.map((d) => {
                    return this.convertDate(d)
                }),
                quote: response.data.chart.result[0].indicators.quote,
                price: Number(response.data.chart.result[0].meta.regularMarketPrice).toFixed(2),
                symbol: response.data.chart.result[0].meta.symbol
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
                    }
                    return {
                        Date: t,
                        Price: p

                    }
                })
            })
        }).catch(error =>{
            console.log(error)
            this.setState({
                data: []
            })
        })
    }

    hover(data){
        if (data.isTooltipActive && data.activePayload) {
            this.setState({ 
                price: Number(data.activePayload[0].payload.Price).toFixed(2), 
                date: data.activePayload[0].payload.Date
            })
        }
    }

    convertDate(epoch){
        const date = new Date(epoch*1000)
        var expr
        if (this.state.toggle === "1d"){
            expr = "Today"
        }else{
            expr = month[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getFullYear()
        }
        return expr
    }
    tooltip(data){
    }

    render(){
        const chart = (
            <ResponsiveContainer width="99%" aspect={3} >
                <LineChart data={this.state.data} onMouseMove={this.hover}>
                    <Tooltip content={this.tooltip}/>
                    <Line type='monotone' dataKey='Price' stroke='#8884d8' strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
        const handleButton = (event, flag) => {
            var period
            var interval
            switch(flag){
                case "1d":
                    period = new Date().setHours(0,0,0,0)/1000
                    interval = "2m"
                    break;
                case "5d":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*5
                    interval = "15m"
                    break;
                case "1m":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*5*31
                    interval = "1h"
                    break;
                case "6m":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*5*6
                    interval = "1d"
                    break;
                case "1y":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*5*12
                    interval = "5d"
                    break;
                case "Max":
                    period = 0
                    interval = "1wk"
                    break;
                default:
                    period = new Date().setHours(0,0,0,0)/1000
                    interval = "2m"
                    break;
            }
            this.setState({
                toggle: flag,
            })
            this.getData(period,interval)
        }
        return(
            <div id="body">
                <Header />
                <div id="container">
                {
                    this.state.loading ? 
                    <div id="loadingContainer">
                        <CircularProgress color='inherit'/> 
                    </div>
                    :
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <Grid item id="chart"> 
                            <Grid container
                                direction="row"
                                justify="space-between"
                                alignItems="flex-end">
                                <Grid item>
                                    <h2>{this.props.contract}</h2>
                                    <h1>${this.state.price}</h1>
                                    <h4>{this.state.date}</h4>
                                </Grid>
                                <Grid item>
                                    <ToggleButtonGroup
                                    size="medium"
                                    value={this.state.toggle}
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
                            </Grid>
                            {chart}
                        </Grid>
                        <Grid item>
                            <ContractInfo ticker={this.props.ticker}
                                          contract={this.props.contract}/>
                        </Grid>
                    </Grid>
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        data: state.app.contractInfo
    }
}


export default connect(mapStateToProps) (Contract)