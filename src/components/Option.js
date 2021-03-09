import React from 'react';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import greeks from '../greeks/greeks';
import OptionTable from './OptionTable';
import { connect } from 'react-redux';
import { calls, puts, exprDate, currTicker, quote } from '../actionReducer/actionReducer';
import OpenInterest from './OpenInterest';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { proxyURL, quoteURL } from '../constants/const'
import Quote from './Quote'

class Option extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            quote: {},
            expirationDateEpoch: this.props.epoch,
            ticker: this.props.match.params.ticker,
            marketStatus: "REGULAR",
            value: 0
        }
        this.updateData = this.updateData.bind(this);
    }

    componentDidMount(){
        this.updateData(this.props.epoch)
    }

    componentDidUpdate(){
        if (this.props.match.params.ticker !== this.state.ticker){
            this.updateData(this.state.expirationDateEpoch)
        }
        if (this.state.marketStatus !== "REGULAR"){
            clearInterval(this.intervalID)
        }
    }

    updateData(epoch){
        const e = epoch ? "?date=" + epoch : ""
        axios.get(proxyURL + quoteURL + this.props.match.params.ticker + e, {
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
                ticker: this.props.match.params.ticker,
            }, () => {
                this.props.quote(this.state.quote)
                this.props.currTicker(this.props.match.params.ticker)
                this.props.callsPuts ?
                this.props.calls(
                    response.data.optionChain.result[0].options[0].calls.map((op) => {
                        if (!op.hasOwnProperty('volume')){ 
                            op['volume'] = 0
                        }
                        var x = greeks(op, true, this.state.expirationDateEpoch, this.state.quote.regularMarketPrice)
                        op['delta'] = x[0]
                        op['gamma'] = x[1]
                        op['theta'] = x[2]
                        op['rho'] = x[3]
                        op['vega'] = x[4]
                        return op
                    })
                )
                : this.props.puts(
                    response.data.optionChain.result[0].options[0].puts.map((op) => {
                        if (!op.hasOwnProperty('volume')){ 
                            op['volume'] = 0
                        }
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
                this.setState({ loading: false })
            })
        }).catch(error =>{
            console.log(error)
            this.props.history.push('/400')
        })
    }

    render(){
        const handleTabs = (event, newValue) => {
            this.setState({ value: newValue })
        }
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
                <div id="container">
                    {
                        this.state.loading ? 
                        <div id="loadingContainer">
                            <CircularProgress color='inherit'/> 
                        </div>
                        :
                        <div id="content">
                            <div id="quoteStats">
                                <Grid container>
                                    <Grid item>
                                        <p className="ticker">{this.state.quote.longName} ({this.state.quote.symbol})</p>
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
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <p className="quoteInfoHeader">High:</p>
                                        <p className="quoteInfo">{Number(this.state.quote.regularMarketDayHigh).toFixed(2)}</p>
                                    </Grid>
                                    <Grid item>
                                        <p className="quoteInfoHeader">Low:</p>
                                        <p className="quoteInfo">{Number(this.state.quote.regularMarketDayLow).toFixed(2)}</p>
                                    </Grid>
                                    <Grid item>
                                        <p className="quoteInfoHeader">Vol:</p>
                                        <p className="quoteInfo">{this.state.quote.regularMarketVolume}</p>
                                    </Grid>
                                </Grid>
                            </div>
                            <Divider/>
                            <div>
                                <Tabs 
                                    value={this.state.value} 
                                    onChange={handleTabs}
                                    variant="scrollable"
                                    scrollButtons="auto">
                                    <Tab label="Option Chain"/>
                                    <Tab label="Open Interest"/>
                                    <Tab label="Quote"/>
                                </Tabs>
                                <TabPanel value={this.state.value} index={0}>
                                    <OptionTable updateData={this.updateData}/>
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1}>
                                    <OpenInterest ticker={this.state.ticker}/>
                                </TabPanel>
                                <TabPanel value={this.state.value} index={2}>
                                    <Quote ticker={this.props.match.params.ticker}/>
                                </TabPanel>
                            </div>
                        </div>
                    }
                </div>
        )
    }
}

function TabPanel(props){
    const {children, value, index} = props
    return(<div>
        {
            value === index && children
        }
    </div>)
}

const mapStateToProps = (state, props) => {
    return {
        epoch: state.app.epoch,
        dark: state.app.dark,
        callsPuts: state.app.callsPuts
    }
}

const mapActionsToProps = dispatch => ({
    calls: (c) => dispatch(calls(c)),
    puts: (p) => dispatch(puts(p)),
    exprDate: (e) => dispatch(exprDate(e)),
    currTicker: (q) => dispatch(currTicker(q)),
    quote: (q) => dispatch(quote(q)),
});

export default connect(mapStateToProps, mapActionsToProps) (Option)