import React from "react";
import axios from "axios";
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { ToggleButton } from '@material-ui/lab';
import Divider from '@material-ui/core/Divider';
import OptionChain from './OptionChain'

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const endpointURL = "https://query1.finance.yahoo.com/v7/finance/options/AAPL"
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
            flag: true
        }
        this.updateData = this.updateData.bind(this)
    }
    componentDidMount(){
        axios.get(proxyURL + endpointURL, {
            headers: {"Content-Type": 'application/json'}
        }).then(response => {
            this.setState({
                quote: response.data.optionChain.result[0].quote,
                calls: response.data.optionChain.result[0].options[0].calls,
                puts: response.data.optionChain.result[0].options[0].puts,
                expiration: response.data.optionChain.result[0].expirationDates,
                expirationDateEpoch: response.data.optionChain.result[0].options.expirationDate,
            })
        }).catch(error=>{
            console.log("error")
        })
    }
    updateData(epoch){
        axios.get(proxyURL + endpointURL + "?date=" + epoch, {
            headers: {"Content-Type": 'application/json'}
        }).then(response => {
            this.setState({
                quote: response.data.optionChain.result[0].quote,
                calls: response.data.optionChain.result[0].options[0].calls,
                puts: response.data.optionChain.result[0].options[0].puts,
                expiration: response.data.optionChain.result[0].expirationDates,
                expirationDateEpoch: response.data.optionChain.result[0].options.expirationDate
            })
        }).catch(error=>{
            console.log("error")
        })
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
        const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
        return(
            <div id="body">
                <div>
                    <h5>{this.state.quote.symbol}</h5>
                    <p>{this.state.quote.longName}</p>
                    <p>{this.state.quote.quoteSourceName}</p>
                    <div>
                        <p>{Number(this.state.quote.regularMarketPrice).toFixed(2)}</p>
                        <p>{this.state.quote.currency}</p>
                    </div>
                </div>
                <div>
                    <Divider id="divider"/>
                    <FormControl variant="outlined" id="expr">
                        <FormHelperText>Expiration</FormHelperText>
                        <Select native disableUnderline onChange={handleChange}>
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
                        <OptionChain chain={this.state.calls} /> :
                        <OptionChain chain={this.state.puts} />
                    }
                </div>
            </div>
        )
    }
}

export default Option