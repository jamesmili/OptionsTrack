import React from "react";
import axios from "axios";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import OptionChain from './OptionChain'
import MenuItem from '@material-ui/core/MenuItem';

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
            expiration: [],
            expirationDateEpoch: null,
            expirationDate: ""
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
                expirationDateEpoch: response.data.optionChain.result[0].options.expirationDate
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
            <div>
                <h5>{this.state.quote.symbol}</h5>
                <p>{this.state.quote.longName}</p>
                <p>{this.state.quote.quoteSourceName}</p>
                <h3>{this.state.quote.regularMarketPrice}  {this.state.quote.currency}</h3>
                <FormControl variant="outlined">
                    <Select value={this.state.expirationDate} onChange={handleChange}>
                        {
                            this.state.expiration.map(expirationDate => {
                                const expr = convertDate(expirationDate)
                                return(
                                    <MenuItem value={expirationDate}>{expr}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <OptionChain calls={this.state.calls} puts={this.state.puts} />
            </div>
        )
    }
}

export default Option