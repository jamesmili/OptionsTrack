import React from "react";
import axios from "axios";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { ToggleButton } from '@material-ui/lab';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Header from '../components/Header'
import OptionChain from '../components/OptionChain'

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const endpointURL = "https://query2.finance.yahoo.com/v7/finance/options/"

class Option extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            error: false,
            quote: {},
            calls: [],
            puts: [],
            expiration: [],
            expirationDateEpoch: null,
            expirationDate: "",
            ticker: this.props.ticker,
            flag: true,
            marketStatus: "REGULAR",
        }
        this.updateData = this.updateData.bind(this)
    }

    async componentDidMount(){
        this.updateData(this.state.expirationDateEpoch)
        this.intervalID = setInterval(() => {
            this.updateData(this.state.expirationDateEpoch)
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

    async updateData(epoch){
        if (this.state.marketStatus === "REGULAR"){
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
                    calls: response.data.optionChain.result[0].options[0].calls,
                    puts: response.data.optionChain.result[0].options[0].puts,
                    expiration: response.data.optionChain.result[0].expirationDates,
                    expirationDateEpoch: response.data.optionChain.result[0].options[0].expirationDate,
                    marketStatus: response.data.optionChain.result[0].quote.marketState,
                    ticker: this.props.ticker
                })
            }).catch(error =>{
                console.log(error)
            })
        }
    }

    render(){
        const handleChange = (event) => {
            const epoch = event.target.value
            this.updateData(epoch)
            this.setState({
                expirationDate: convertDate(epoch),
                expirationDateEpoch: epoch
            })
        }
        const convertDate = (epoch) => {
            const date = new Date(epoch*1000)
            const expr = month[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getFullYear()
            return expr
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
        const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
        return(
            <div>
                <Header/>
                <div id="body">
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
                    <div>
                        <Divider id="divider"/>
                        <FormControl variant="outlined" id="expr">
                            <FormHelperText>Expiration</FormHelperText>
                            <Select native onChange={handleChange}>
                                {
                                    this.state.expiration.map(expirationDate => {
                                        const expr = convertDate(expirationDate)
                                        return(
                                            <option key={expirationDate} value={expirationDate}>{expr}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <div id="callsputs">
                            <ToggleButton
                                value="color"
                                selected={this.state.flag}
                                onChange={() => {this.setState( {flag: true})}}
                            >
                                Calls
                            </ToggleButton>
                            <ToggleButton
                                value="color"
                                selected={!this.state.flag}
                                onChange={() => {this.setState( {flag: false})}}
                            >
                                Puts
                            </ToggleButton>
                        </div>
                        {
                            this.state.flag?
                            <OptionChain chain={this.state.calls} 
                                         quote={this.state.quote}
                                         date={this.state.expirationDateEpoch}
                                         call={true}/> 
                            :
                            <OptionChain chain={this.state.puts}
                                         quote={this.state.quote}
                                         date={this.state.expirationDateEpoch}
                                         call={false}/> 
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Option