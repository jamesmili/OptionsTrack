import React from 'react'
import axios from "axios";
import { proxyURL, chartURL, month } from '../constants/const';
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from 'recharts';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import QuoteInfo from './QuoteInfo';

class Quote extends React.Component{
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
            high: 999999,
            low: 0,
        }
        this.hover = this.hover.bind(this)
        this.convertDate = this.convertDate.bind(this)
        this.tooltip = this.tooltip.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentDidMount(){
        var period = new Date().setHours(0,0,0,0)/1000 - 60*60*24
        var interval = "2m"
        this.getData(period, interval)
        this.setState({
            loading: false
        })
    }
    componentDidUpdate(){
        if (this.props.ticker !== this.state.symbol){
            var period = new Date().setHours(0,0,0,0)/1000 - 60*60*24
            var interval = "2m"
            this.getData(period, interval)
        }
    }

    getData(period, interval){
        axios.get(proxyURL + chartURL + this.props.ticker + "?period1=" + period + "&period2=9999999999&interval=" + interval, {
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
                <LineChart data={this.state.data} onMouseMove={this.hover} margin={{right: 15, left: 15}}>
                    <YAxis tick={false} domain={[this.state.low, this.state.high]}/>
                    <Tooltip />
                    <Line type='monotone' dataKey='Price' stroke='#8884d8' strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
        const handleButton = (event, flag) => {
            var period
            var interval
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
                        <Grid item id="chart"> 
                            <Grid container
                                direction="row"
                                justify="flex-end"
                                alignItems="flex-start"
                                spacing={8}>
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
                                {chart}
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

export default Quote;