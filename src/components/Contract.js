import React from 'react'
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import ContractInfo from './ContractInfo';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { proxyURL, chartURL } from '../constants/const';

class Contract extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            data: [],
            price: 0.00,
            date: "",
            toggle: "1d",
        }
        this.hover = this.hover.bind(this)
        this.convertDate = this.convertDate.bind(this)
        this.tooltip = this.tooltip.bind(this)
        this.getData = this.getData.bind(this)
    }
    componentDidMount(){
        var period = new Date().setHours(0,0,0,0)/1000 + 60*60*9.5
        var period2 = period + 60*60*6.5
        var interval = "2m"
        this.getData(period, period2, interval)
        this.setState({
            loading: false
        })
    }

    getData(period, period2, interval){
        var p1
        var day = new Date(period*1000).getDay()
        //weekend
        if (day === 0 || day === 6){
            p1 = "?"
        }else{
            p1 = "?period1=" + period + "&"
        }
        axios.get(proxyURL + chartURL + this.props.match.params.contract + p1 + "period2=" + period2 + "&interval=" + interval, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var p = 0.00
            this.setState({
                price: Number(response.data.chart.result[0].meta.regularMarketPrice).toFixed(2),
                date: this.convertDate(response.data.chart.result[0].timestamp[response.data.chart.result[0].timestamp.length - 1]),
                data: response.data.chart.result[0].timestamp.map((d,index) => {
                    if (response.data.chart.result[0].indicators.quote[0].close[index]){
                        p = Number(response.data.chart.result[0].indicators.quote[0].close[index].toFixed(2))
                    }
                    return {
                        Date: this.convertDate(d),
                        Price: p

                    }
                }),
            })
        }).catch(error =>{
            console.log(error)
            this.setState({
                data: []
            })
            this.props.history.push('/400')
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
            expr = date.toLocaleDateString(undefined,  {year: 'numeric', month: 'short', day: 'numeric'})
        }
        return expr
    }

    tooltip(data){
    }

    render(){
        
        const chart = (
            <ResponsiveContainer width="99%" height={400} >
                <LineChart data={this.state.data} onMouseMove={this.hover}>
                    <Tooltip content={this.tooltip}/>
                    <Line type='monotone' dataKey='Price' stroke='#8884d8' strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
        const handleButton = (event, flag) => {
            var period, period2, interval
            switch(flag){
                case "1d":
                    period = new Date().setHours(0,0,0,0)/1000 + 60*60*9.5
                    period2 = period + 60*60*6.5
                    interval = "2m"
                    break;
                case "5d":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*5
                    period2 = 9999999999
                    interval = "15m"
                    break;
                case "1m":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*31
                    period2 = 9999999999
                    interval = "1h"
                    break;
                case "6m":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*183
                    period2 = 9999999999
                    interval = "1d"
                    break;
                case "1y":
                    period = (new Date().setHours(0,0,0,0)/1000) - 60*60*24*365
                    period2 = 9999999999
                    interval = "1d"
                    break;
                case "Max":
                    period = 0
                    period2 = 9999999999
                    interval = "1d"
                    break;
                default:
                    period = new Date().setHours(0,0,0,0)/1000
                    period2 = 9999999999
                    interval = "2m"
                    break;
            }
            this.setState({
                toggle: flag,
            })
            this.getData(period, period2, interval)
        }
        return(
                <div id="container">
                {
                    this.state.loading ? 
                    <div id="loadingContainer">
                        <CircularProgress color='inherit'/> 
                    </div>
                    :
                    <div id="content">
                        <Grid container
                            direction="column"
                            justify="center"
                            alignItems="center">
                            <Grid item xs={12} className="list"> 
                                <Grid container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <h2>{this.props.match.params.contract}</h2>
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
                                    <Grid item xs={12} className="list">
                                        {chart}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className="list">
                                <ContractInfo ticker={this.props.match.params.ticker}
                                            contract={this.props.match.params.contract}
                                            history={this.props.history}
                                            />
                            </Grid>
                        </Grid>
                    </div>
                }
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