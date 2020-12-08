import React from 'react';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import axios from "axios";
import { connect } from 'react-redux';
import { epoch } from '../actionReducer/actionReducer';
import { proxyURL, quoteURL } from '../constants/const'
import CircularProgress from '@material-ui/core/CircularProgress';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, Line, ResponsiveContainer} from 'recharts';

class OpenInterest extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: [],
            calls: 0,
            puts: 0,
            maxPainStrike: 0,
            loading: true
        }
        this.updateData = this.updateData.bind(this)
    }
    componentDidMount(){
        this.updateData(this.props.epochVal)
    }
    updateData(epoch){
        const e = epoch ? "?date=" + epoch : ""
        axios.get(proxyURL + quoteURL + this.props.ticker + e, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var calls = response.data.optionChain.result[0].options[0].calls
            var puts = response.data.optionChain.result[0].options[0].puts
            var data1 = []
            var data2 = []
            var data = []
            var c = 0
            var p = 0
            var maxPain = Infinity
            var maxPainStrike = 0
            var indexCalls = calls.findIndex(x => x.inTheMoney === false)
            var indexPuts = puts.findIndex(x => x.inTheMoney === true)
            for (var i = indexCalls-10; i < indexCalls+10; i++){
                if (calls[i])
                {
                    data1.push({
                        "strike": Number(calls[i].strike).toFixed(2),
                        "Calls": calls[i].openInterest,
                        "callPrice": calls[i].lastPrice,
                        "cITM": calls[i].inTheMoney
                    })
                    c += calls[i].openInterest ? calls[i].openInterest : 0
                }
            }
            for (var j = indexPuts-10; j < indexPuts+10; j++){
                if (puts[j])
                {
                    data2.push({
                        "strike": Number(puts[j].strike).toFixed(2),
                        "Puts": puts[j].openInterest,
                        "putPrice": puts[j].lastPrice,
                        "pITM": puts[j].inTheMoney
                    })
                    p += puts[j].openInterest ? puts[j].openInterest : 0
                }
            }    
            for (var k = 0; k < data1.length; k++){
                var obj = data2.find(e => e.strike === data1[k].strike)
                if (obj){
                    data.push({
                        "strike": data1[k].strike,
                        "Calls": data1[k].Calls,
                        "callPrice": data1[k].callPrice,
                        "cITM": data1[k].cITM,
                        "Puts": obj.Puts,
                        "putPrice": obj.putPrice,
                        "pITM": obj.pITM
                    })
                }
            }
            for (var l = 0; l < data.length; l++){
                var diff = Number(Math.abs(Number(data[l].strike)- Number(this.props.quote.regularMarketPrice)).toFixed(2))
                var put = data[l].pITM ? diff * data[l].Puts * 100 : 0
                var call = data[l].cITM ? diff * data[l].Calls * 100 : 0
                data[l]['Value'] = Number(put.toFixed(2)) + Number(call.toFixed(2))
                if(data[l].Value < maxPain){
                    maxPainStrike = data[l].strike
                    maxPain = data[l].Value
                }
            }
            this.setState({
                data: data,
                calls: c,
                puts: p,
                maxPainStrike: maxPainStrike,
                loading: false
            })
        }).catch(error =>{
            console.log(error)
        })
    }
    render(){
        const handleChange = (event) => {
            const epoch = event.target.value
            this.props.epoch(epoch)
            this.updateData(epoch)
        }
        const convertDate = (epoch) => {
            const date = new Date(epoch*1000 + 1000*60*60*10)
            const expr = date.toLocaleDateString(undefined,  {year: 'numeric', month: 'short', day: 'numeric'})
            return expr
        }
        const formatYAxis = (tickItem) => {
            return (tickItem/1000).toString()+"K"
        }
        return(
                <div className="tabs">
                    {
                        this.state.loading ? 
                        <div id="loadingContainer">
                            <CircularProgress color='inherit'/> 
                        </div>
                    :
                    <div>
                        <Grid container
                            direction="row"
                            justify="space-between"
                            alignItems="center">
                            <Grid item>
                                <p>Calls:</p>
                                <h3>{this.state.calls}</h3>
                            </Grid>
                            <Grid item>
                                <p>Puts:</p>
                                <h3>{this.state.puts}</h3>
                            </Grid>
                            <Grid item>
                                <p>Total:</p>
                                <h3>{this.state.calls + this.state.puts}</h3>
                            </Grid>
                            <Grid item>
                                <p>Calls/Puts Ratio:</p>
                                <h3>{Number((this.state.calls/this.state.puts).toFixed(2))}</h3>
                            </Grid>
                            <Grid item>
                                <p>Max-Pain Strike Price:</p>
                                <h3>{this.state.maxPainStrike}</h3>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <FormHelperText>Expiration</FormHelperText>
                                    <Select native onChange={handleChange} value={this.props.epochVal}>
                                        {
                                            this.props.exprDate.map(expirationDate => {
                                                const expr = convertDate(expirationDate)
                                                return(
                                                    <option key={expirationDate} value={expirationDate}>{expr}</option>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <div>
                            <ResponsiveContainer width="100%" height={500} >
                                <ComposedChart 
                                    width={1080} 
                                    height={500} 
                                    data={this.state.data}
                                    barGap={0}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="strike" height={60} label={{ 
                                        value: "Strike Price", position: "insideBottom", dy: -10}}/>
                                    <YAxis yAxisId="left" orientation="left" tickFormatter={formatYAxis}  
                                        label={{ 
                                            value: "Open Interest", position: "insideLeft", angle: -90,
                                        }}/>
                                    <YAxis yAxisId="right" orientation="right" width={90} tickFormatter={formatYAxis} 
                                        label={{ 
                                            value: "Value in USD", position: "insideRight", angle: -90, dy: -90
                                        }}/>
                                    <Tooltip />
                                    <Legend layout="horizontal" verticalAlign="top" />
                                    <Bar yAxisId="left" dataKey="Puts" fill="#F57979" />
                                    <Bar yAxisId="left" dataKey="Calls" fill="#06EA8C" />
                                    <Line type="monotone" yAxisId="right" dataKey="Value" fill="#8884D8"/>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        exprDate: state.app.exprDate,
        epochVal: state.app.epoch,
        quote: state.app.quote
    }
}

const mapActionsToProps = dispatch => ({
    epoch: (e) => dispatch(epoch(e))
});


export default connect(mapStateToProps, mapActionsToProps)(OpenInterest)