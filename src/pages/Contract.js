import React from 'react'
import Header from '../components/Header'
import axios from "axios";
import { AreaChart, Area, CartesianGrid, Tooltip } from 'recharts';
import ContractInfo from '../components/ContractInfo';
import Grid from '@material-ui/core/Grid';

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const endpointURL = "https://query1.finance.yahoo.com/v7/finance/chart/"
const interval = "?period1=0&period2=9999999999&interval=1d"
const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

class Contract extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            meta: null,
            timestamp: [],
            quote: [],
            data: [],
            price: 0.00,
            date: "",
            symbol: null,
        }
        this.hover = this.hover.bind(this)
        this.convertDate = this.convertDate.bind(this)
        this.tooltip = this.tooltip.bind(this)
    }
    componentDidMount(){
        axios.get(proxyURL + endpointURL + this.props.contract + interval, {
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
                        p = response.data.chart.result[0].indicators.quote[0].close[index]
                        prevPrice = p
                    }
                    return {
                        date: t,
                        price: p

                    }
                })
            })
        }).catch(error =>{
            console.log(error)
        })

    }

    hover(data){
        if (data.isTooltipActive && data.activePayload) {
            this.setState({ 
                price: data.activePayload[0].value.toFixed(2), 
                date: data.activePayload[0].payload.date
            })
        }
    }

    convertDate(epoch){
        const date = new Date(epoch*1000)
        const expr = month[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getFullYear()
        return expr
    }
    tooltip(data){

    }

    render(){
        const chart = (
            <AreaChart width={730} height={300} data={this.state.data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    onMouseMove={this.hover}>
                <Tooltip content={this.tooltip}/>
                <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
                <CartesianGrid stroke="none" />
            </AreaChart>
        )
        return(
            <div id="body">
                <Header />
                <div id="container">
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Grid item> 
                            <h2>{this.state.symbol}</h2>
                            <h1>${this.state.price}</h1>
                            <h4>{this.state.date}</h4>
                            {chart}
                        </Grid>
                        <Grid item>
                            <ContractInfo ticker={this.props.ticker}
                                          contract={this.props.contract}/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Contract