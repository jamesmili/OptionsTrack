import {useState, useEffect} from 'react';
import axios from "axios";

import greeks from '../greeks/greeks';
import OptionTable from './OptionTable';
import { useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { proxyURL, quoteURL } from '../constants/const'
import SearchBar from "material-ui-search-bar";
import {Redirect} from 'react-router-dom'
import OpenInterest from './OpenInterest';
import Quote from './Quote';
import Card from './Card';
import VolumeOptionChart from './VolumeOptionChart';

function Option(props){

    let [tickerSearch, setTickerSearch] = useState("")
    let [route, setRoute] = useState(false)
    let [callsVol, setCallsVol] = useState([])
    let [putsVol, setPutsVol] = useState([])
    let [calls, setCalls] = useState([])
    let [puts, setPuts] = useState([])
    const dispatch = useDispatch()
    let [loading, setLoading] = useState(true)
    let [quote, setQuote] = useState({})
    let [expirationDateEpoch, setExpirationDateEpoch] = useState(0)
    let [ticker, setTicker] = useState("")

    useEffect(() => {
        if (props.match.params.ticker !== ticker){
            updateData(expirationDateEpoch)
        }
        return() => {
            setLoading(true)
        }
    },[props.match.params.ticker, ticker])

    const updateData = async (epoch) => {
        const e = epoch ? "?date=" + epoch : ""
        await axios.get(proxyURL + quoteURL + props.match.params.ticker + e, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            let calls = []
            let puts = []
            setQuote(response.data.optionChain.result[0].quote)
            setExpirationDateEpoch(response.data.optionChain.result[0].options[0].expirationDate)
            setTicker(props.match.params.ticker)
            dispatch({
                type: "TICKER",
                currTicker: props.match.params.ticker
            })
            dispatch({
                type: "CALLS",
                calls: response.data.optionChain.result[0].options[0].calls.map((op) => {
                    if (!op.hasOwnProperty('volume')){ 
                        op['volume'] = 0
                        calls.push({
                            strike: Number(op.strike).toFixed(2),
                            volume: 0
                        })
                    }
                    else{
                        calls.push({
                            strike: Number(op.strike).toFixed(2),
                            volume: op.volume
                        })
                    }
                    var x = greeks(op, true, expirationDateEpoch, quote.regularMarketPrice)
                    op['delta'] = x[0]
                    op['gamma'] = x[1]
                    op['theta'] = x[2]
                    op['rho'] = x[3]
                    op['vega'] = x[4]
                    return op
                })
            })
            dispatch({
                type: "PUTS",
                puts: response.data.optionChain.result[0].options[0].puts.map((op) => {
                    if (!op.hasOwnProperty('volume')){ 
                        op['volume'] = 0
                        puts.push({
                            strike: Number(op.strike).toFixed(2),
                            volume: 0
                        })
                    }else{
                        puts.push({
                            strike: Number(op.strike).toFixed(2),
                            volume: op.volume
                        })
                    }
                    var x = greeks(op, true, expirationDateEpoch, quote.regularMarketPrice)
                    op['delta'] = x[0]
                    op['gamma'] = x[1]
                    op['theta'] = x[2]
                    op['rho'] = x[3]
                    op['vega'] = x[4]
                    return op
                })
            })
            dispatch({
                type: "QUOTE",
                quote: quote,
            })
            dispatch({
                type: "TICKER",
                currTicker: props.match.params.ticker
            })
            dispatch({
                type: "EXPIRATION_DATE",
                exprDate: response.data.optionChain.result[0].expirationDates
            })
            setCallsVol(calls)
            setPutsVol(puts)
            setCalls(response.data.optionChain.result[0].options[0].calls)
            setPuts(response.data.optionChain.result[0].options[0].puts)
        }).then(() => {
            setLoading(false)
        }).catch(error =>{
            console.log(error)
        })
    }

    const onSearch = (value) => {
        setTickerSearch(value)
        setRoute(true)
    }

    const regMarketPriceChange = () => {
        if (quote.regularMarketChange > 0){
            return(
                <p className="mr-4 text-green-400">+{Number(quote.regularMarketChange).toFixed(2)}</p>
            )
        }else if (quote.regularMarketChange < 0){
            return(
                <p className="mr-4 text-red-400">{Number(quote.regularMarketChange).toFixed(2)}</p>
            )                
        }else{
            return(
                <p className="mr-4">{Number(quote.regularMarketChange).toFixed(2)}</p>
            )
        }
    }

    const regMarketPriceChangePer = () => {
        if (quote.regularMarketChangePercent > 0){
            return(
                <p className="mr-4 text-green-400">+{Number(quote.regularMarketChangePercent).toFixed(2)}%</p>
            )
        }else if (quote.regularMarketChangePercent < 0){
            return(
                <p className="mr-4 text-red-400">{Number(quote.regularMarketChangePercent).toFixed(2)}%</p>
            )
        }else{
            return(
                <p className="mr-4">{Number(quote.regularMarketChangePercent).toFixed(2)}%</p>
            )
        }
    }
    return(
        <div className="text-gray-300 w-full overflow-auto mt-5 mb-5">
        {
            loading ? 
            <div id="loadingContainer">
                <CircularProgress color='inherit'/> 
            </div>
            :
            <div className="xl:ml-20 xl:mr-20 lg:ml-10 lg:ml-10 md:ml-5 md:ml-5 ml-5 mr-5 space-y-5">
                <div className="container mx-auto">
                    <div>
                        <div className="flex flex-col lg:flex-row  justify-between items-center">
                            <div>
                                <p className="text-2xl">{quote.longName}</p>
                                <p className="text-gray-600">Ticker: ${ticker.toUpperCase()}</p>
                            </div>
                            <SearchBar
                                onRequestSearch={(v) => onSearch(v)}
                                id="searchBar"
                                placeholder="Search Ticker"
                            />
                            {route && <Redirect to={'/options/'+ tickerSearch} />}

                        </div>
                        <div className="my-5 flex-col flex lg:flex-row xl:space-x-5">
                            <Card header={"Current Price:"} data={`$${Number(quote.regularMarketPrice).toFixed(2)}`}/>
                            <Card header={"Price Change:"} data={regMarketPriceChange()}/>
                            <Card header={"% Change:"} data={regMarketPriceChangePer()}/>
                            <Card header={"High:"} data={Number(quote.regularMarketDayHigh).toFixed(2)}/>
                            <Card header={"Low:"} data={Number(quote.regularMarketDayLow).toFixed(2)}/>
                            <Card header={"Volume:"} data={quote.regularMarketVolume}/>
                        </div>
                    </div>
                    <Quote className="container mx-auto" ticker={props.match.params.ticker}/>
                    <div className="bg-gray-800 rounded-md md:my-3">
                        <OptionTable updateData={updateData}/>
                    </div>
                    <div className="self-center" >
                        <OpenInterest calls={calls} puts={puts}/>
                    </div>
                    <div className="my-5 flex-col flex lg:flex-row xl:space-x-5">
                        <VolumeOptionChart datakey={"strike"} xaxis={"Strike Price"} yaxis={"Volume"} 
                                data={callsVol} title={"CALL OPTION VOLUME"} colour={"#34D399"}
                                num={1000} symbol={"K"}/>
                        <VolumeOptionChart datakey={"strike"} xaxis={"Strike Price"} yaxis={"Volume"} 
                                data={putsVol} title={"PUT OPTION VOLUME"} colour={"#F87171"}
                                num={1000} symbol={"K"}/>
                    </div>
                </div>
            </div>
        }
    </div>
    )
}

export default Option