import React from 'react';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import { epoch } from '../state/app';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, Line, ResponsiveContainer} from 'recharts';

class OpenInterest extends React.Component{
    render(){
        const handleChange = (event) => {
            const epoch = event.target.value
            this.props.epoch(epoch)
            this.props.updateData(epoch)
        }
        const convertDate = (epoch) => {
            const date = new Date(epoch*1000)
            const expr = month[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getFullYear()
            return expr
        }
        const formatYAxis = (tickItem) => {
            return (tickItem/1000).toString()+"K"
        }
        const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
        return(
                <div className="tabs">
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="center">
                        <Grid item>
                            <p>Calls:</p>
                            <h3>{this.props.calls}</h3>
                        </Grid>
                        <Grid item>
                            <p>Puts:</p>
                            <h3>{this.props.puts}</h3>
                        </Grid>
                        <Grid item>
                            <p>Total:</p>
                            <h3>{this.props.calls + this.props.puts}</h3>
                        </Grid>
                        <Grid item>
                            <p>Calls/Puts Ratio:</p>
                            <h3>{Number((this.props.calls/this.props.puts).toFixed(2))}</h3>
                        </Grid>
                        <Grid item>
                            <p>Max-Pain Strike Price:</p>
                            <h3>{this.props.maxPainStrike}</h3>
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
                                data={this.props.data}
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
                                <Bar yAxisId="left" dataKey="Puts" fill="#FF8B8B" />
                                <Bar yAxisId="left" dataKey="Calls" fill="#8BD5FF" />
                                <Line type="monotone" yAxisId="right" dataKey="Value" fill="#8884D8"/>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    var data1 = []
    var data2 = []
    var data = []
    var c = 0
    var p = 0
    var maxPain = Infinity
    var maxPainStrike = 0
    for (var i = 0; i < state.app.calls.length; i++){
        if (Math.abs(state.app.calls[i].strike-state.app.quote.regularMarketPrice) <= state.app.quote.regularMarketPrice*.05){
            data1.push({
                "strike": Number(state.app.calls[i].strike).toFixed(2),
                "Calls": state.app.calls[i].openInterest,
                "callPrice": state.app.calls[i].lastPrice,
                "cITM": state.app.calls[i].inTheMoney
            })
        }
        c += state.app.calls[i].openInterest ? state.app.calls[i].openInterest : 0
    }

    for (var j = 0; j < state.app.puts.length; j++){
        if (Math.abs(state.app.puts[j].strike-state.app.quote.regularMarketPrice) <= state.app.quote.regularMarketPrice*.05){
            data2.push({
                "strike": Number(state.app.puts[j].strike).toFixed(2),
                "Puts": state.app.puts[j].openInterest,
                "putPrice": state.app.puts[j].lastPrice,
                "pITM": state.app.puts[j].inTheMoney
            })
        }
        p += state.app.puts[j].openInterest ? state.app.puts[j].openInterest : 0
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
        var diff = Number(Math.abs(Number(data[l].strike)- Number(state.app.quote.regularMarketPrice)).toFixed(2))
        var puts = data[l].pITM ? diff * data[l].Puts * 100 : 0
        var calls = data[l].cITM ? diff * data[l].Calls * 100 : 0
        data[l]['Value'] = Number(puts.toFixed(2)) + Number(calls.toFixed(2))
        if(data[l].Value < maxPain){
            maxPainStrike = data[l].strike
            maxPain = data[l].Value
        }
    }
    return {
        data: data,
        exprDate: state.app.exprDate,
        epochVal: state.app.epoch,
        calls: c,
        puts: p,
        maxPainStrike: maxPainStrike
    }
}

const mapActionsToProps = dispatch => ({
    epoch: (e) => dispatch(epoch(e))
});


export default connect(mapStateToProps, mapActionsToProps)(OpenInterest)