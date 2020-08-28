import React from 'react'
import Header from '../components/Header'
import axios from "axios";
import { AreaChart, Area, CartesianGrid, Tooltip } from 'recharts';

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const endpointURL = "https://query1.finance.yahoo.com/v7/finance/chart/"
const interval = "?period1=0&period2=9999999999&interval=1d"

class Contract extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            meta: null,
            timestamp: [],
            quote: [],
            data: [],
            price: 0.00
        }
        this.hover = this.hover.bind(this)
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
                timestamp: response.data.chart.result[0].timestamp,
                quote: response.data.chart.result[0].indicators.quote,
                price: response.data.chart.result[0].indicators.quote[0].close[response.data.chart.result[0].indicators.quote[0].close.length - 1],
                data: response.data.chart.result[0].timestamp.map((t,index) => {
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
            console.log(data)
            this.setState({ price: data.activePayload[0].value.toFixed(2) })
        }
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
            <div>
                <Header />
                <div id="body">
                    <h1>${this.state.price}</h1>
                    {chart}
                </div>
            </div>
        )
    }
}

export default Contract