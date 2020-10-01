import React, { useCallback } from 'react';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import Header from '../components/Header';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import greeks from '../greeks/greeks';
import OptionTable from '../components/OptionTable';
import { connect } from 'react-redux';
import { calls, puts, exprDate, currTicker } from '../state/app';


const proxyURL = "https://nameless-mesa-82672.herokuapp.com/";
const endpointURL = "https://query2.finance.yahoo.com/v7/finance/options/"

class Option extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            quote: {},
            expirationDateEpoch: this.props.epoch,
            ticker: this.props.ticker,
            flag: true,
            marketStatus: "REGULAR",
        }
        this.updateData = this.updateData.bind(this);
    }

    componentDidMount(){
        this.updateData(this.props.epoch)
        this.intervalID = setInterval(() => {
            this.updateData(this.props.epoch)
        },1000)
    }
    componentWillUnmount(){
        clearInterval(this.intervalID)
    }

    componentDidUpdate(){
        if (this.props.ticker !== this.state.ticker){
            this.updateData(this.state.expirationDateEpoch)
        }
        if (this.state.marketStatus !== "REGULAR"){
            clearInterval(this.intervalID)
        }
    }

    updateData(epoch){
        console.log("update")
        const e = epoch ? "?date=" + epoch : ""
        axios.get(proxyURL + endpointURL + this.props.ticker + e, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this.setState({
                quote: response.data.optionChain.result[0].quote,
                expirationDateEpoch: response.data.optionChain.result[0].options[0].expirationDate,
                marketStatus: response.data.optionChain.result[0].quote.marketState,
                ticker: this.props.ticker,
            })
            this.props.currTicker(this.props.ticker)
            this.props.calls(
                response.data.optionChain.result[0].options[0].calls.map((op) => {
                    var x = greeks(op, true, this.state.expirationDateEpoch, this.state.quote.regularMarketPrice)
                    op['delta'] = x[0]
                    op['gamma'] = x[1]
                    op['theta'] = x[2]
                    op['rho'] = x[3]
                    op['vega'] = x[4]
                    return op
                })
            )
            this.props.puts(response.data.optionChain.result[0].options[0].puts.map((op) => {
                        var x = greeks(op, true, this.state.expirationDateEpoch, this.state.quote.regularMarketPrice)
                        op['delta'] = x[0]
                        op['gamma'] = x[1]
                        op['theta'] = x[2]
                        op['rho'] = x[3]
                        op['vega'] = x[4]
                        return op
                    })
            )
            this.props.exprDate(response.data.optionChain.result[0].expirationDates)
        }).catch(error =>{
            console.log(error)
        })
    }

    render(){
        const regMarketPriceChange = () => {
            if (this.state.quote.regularMarketChange > 0){
                return(
                    <p className="gain">+{Number(this.state.quote.regularMarketChange).toFixed(2)}</p>
                )
            }else if (this.state.quote.regularMarketChange < 0){
                return(
                    <p className="loss">{Number(this.state.quote.regularMarketChange).toFixed(2)}</p>
                )                
            }else{
                return(
                    <p>{Number(this.state.quote.regularMarketChange).toFixed(2)}</p>
                )
            }
        }

        const regMarketPriceChangePer = () => {
            if (this.state.quote.regularMarketChangePercent > 0){
                return(
                    <p className="gain">(+{Number(this.state.quote.regularMarketChangePercent).toFixed(2)}%)</p>
                )
            }else if (this.state.quote.regularMarketChangePercent < 0){
                return(
                    <p className="loss">({Number(this.state.quote.regularMarketChangePercent).toFixed(2)}%)</p>
                )
            }else{
                return(
                    <p>({Number(this.state.quote.regularMarketChangePercent).toFixed(2)}%)</p>
                )
            }
        }
        return(
            <div id="body">
                <Header/>
                <div id="container">
                    <div>
                        <Grid container>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <p className="ticker">{this.state.quote.longName}</p>
                                </Grid>
                                <Grid item>
                                    <p className="ticker">({this.state.quote.symbol})</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <p id="exchange">{this.state.quote.quoteSourceName}.</p>
                                </Grid>
                                <Grid item>
                                    <p id="currency">Currency in {this.state.quote.currency}.</p>
                                </Grid>                  
                            </Grid>
                        </Grid>
                        <Grid container 
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={1}>
                            <Grid item>
                                <p id="price">{Number(this.state.quote.regularMarketPrice).toFixed(2)}</p>
                            </Grid>
                            <Grid item>
                                {regMarketPriceChange()}
                            </Grid>
                            <Grid item>
                                {regMarketPriceChangePer()}
                            </Grid>
                        </Grid>
                    </div>
                    <OptionTable updateData={this.updateData}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        epoch: state.app.epoch
    }
}

const mapActionsToProps = dispatch => ({
    calls: (c) => dispatch(calls(c)),
    puts: (p) => dispatch(puts(p)),
    exprDate: (e) => dispatch(exprDate(e)),
    currTicker: (q) => dispatch(currTicker(q))
});

export default connect(mapStateToProps, mapActionsToProps) (Option)