import {useState, useEffect} from 'react';
import axios from "axios";

import { useDispatch, useSelector } from 'react-redux';
import { proxyURL, cryptoOptionsURL } from '../constants/const'
import Option from './Option'

function Crypto(props){

    let [callsVol, setCallsVol] = useState([])
    let [putsVol, setPutsVol] = useState([])
    let [calls, setCalls] = useState([])
    let [puts, setPuts] = useState([])
    const dispatch = useDispatch()
    let [loading, setLoading] = useState(true)
    let [quote, setQuote] = useState({})
    let [ticker, setTicker] = useState("")
    let [chart, setChart] = useState([])
    const epoch = useSelector(state => state.app.epoch)

    const m = {
        'JAN': 0,
        'FEB': 1,
        'MAR': 2,
        'APR': 3,
        'MAY': 4,
        'JUN': 5,
        'JUL': 6,
        'AUG': 7,
        'SEP': 8,
        'OCT': 9,
        'NOV': 10,
        'DEC': 11
    }

    useEffect(() => {
        if (props.match.params.ticker !== ticker){
            updateData(epoch)
        }
    },[props.match.params.ticker, ticker, epoch])

    const updateData = (epoch) => {
        var endTime = Date.now()
        var startTime = endTime - 15634807000
        Promise.all([
            axios.get(proxyURL + "https://www.deribit.com/api/v2/public/get_book_summary_by_instrument?instrument_name=" + props.match.params.ticker + "-PERPETUAL"),
            axios.get(proxyURL + cryptoOptionsURL + "currency=" + props.match.params.ticker + "&kind=option"),
            axios.get(proxyURL+"https://www.deribit.com/api/v2/public/get_tradingview_chart_data?instrument_name=" + props.match.params.ticker + "-PERPETUAL&start_timestamp=" + startTime + "&end_timestamp="+ endTime + "&resolution=60")
        ]).then(response => {
            var quote = {
                longName: response[0].data.result[0].instrument_name,
                regularMarketPrice: response[0].data.result[0].mark_price,
                regularMarketVolume: response[0].data.result[0].volume,
                regularMarketChange: response[0].data.result[0].mark_price-response[0].data.result[0].low,
                regularMarketChangePercent: response[0].data.result[0].price_change,
                regularMarketDayHigh: response[0].data.result[0].high,
                regularMarketDayLow: response[0].data.result[0].low,
            }
            setQuote(quote)

            var exprDate = []
            var chain = []
            var callsVol = []
            var putsVol = []
            const regex = /[0-9]{1,2}/g
            const regex2 = /[0-9]{1,2}[A-Z]{3}[0-9]{1,2}/g
            const regex3 = /[A-Z]{3}/g
            const regex4 = /\-[0-9]+\-/g
            for(var i=0; i<response[1].data.result.length; i++){
                var dy = response[1].data.result[i]['underlying_index'].match(regex)
                var day = parseInt(dy[0])
                var year = parseInt(dy[1])+2000
                var month = m[response[1].data.result[i]['underlying_index'].match(regex2)[0].match(regex3)[0]]
                var date = new Date(year, parseInt(month), parseInt(day)).getTime() /1000
                if (exprDate.includes(date) === false){
                    exprDate.push(date)
                }
                if (chain.hasOwnProperty(date) === false){
                    chain[date] = {calls: [], puts: []}
                }
                var strike = parseInt(response[1].data.result[i].instrument_name.match(regex4)[0].replaceAll("-",""))
                var currentPrice = quote.regularMarketPrice
                if(response[1].data.result[i]['instrument_name'].charAt(response[1].data.result[i]['instrument_name'].length-1) === 'C'){
                    chain[date].calls.push(
                        {
                            contractSymbol: response[1].data.result[i].instrument_name,
                            strike: strike,
                            currency: "USD",
                            lastPrice: response[1].data.result[i].last*currentPrice,
                            change: response[1].data.result[i].last*currentPrice - response[1].data.result[i].low*currentPrice,
                            percentChange: response[1].data.result[i].price_change,
                            openInterest: response[1].data.result[i].open_interest,
                            bid: response[1].data.result[i].bid_price*currentPrice,
                            ask: response[1].data.result[i].ask_price*currentPrice,
                            expiration: date,
                            impliedVolatility: Math.sqrt((2*Math.PI)/((date-Date.now()/1000)/(60 * 60 * 24 * 365))) * ((response[1].data.result[i].last*currentPrice)/currentPrice),
                            inTheMoney: strike < currentPrice,
                            volume: response[1].data.result[i].volume,
                            delta: 0,
                            gamma: 0,
                            theta: 0,
                            rho: 0,
                            vega: 0
                        }
                    )
                    callsVol.push({
                        strike: strike,
                        volume: response[1].data.result[i].volume
                    })
                }else{
                    chain[date].puts.push(
                        {
                            contractSymbol: response[1].data.result[i].instrument_name,
                            strike: strike,
                            currency: "USD",
                            lastPrice: response[1].data.result[i].last*currentPrice,
                            change: response[1].data.result[i].last*currentPrice - response[1].data.result[i].low*currentPrice,
                            percentChange: response[1].data.result[i].price_change,
                            openInterest: response[1].data.result[i].open_interest,
                            bid: response[1].data.result[i].bid_price*currentPrice,
                            ask: response[1].data.result[i].ask_price*currentPrice,
                            expiration: date,
                            impliedVolatility: Math.sqrt((2*Math.PI)/((date-Date.now()/1000)/(60 * 60 * 24 * 365))) * ((response[1].data.result[i].last*currentPrice)/currentPrice),
                            inTheMoney: strike > currentPrice,
                            volume: response[1].data.result[i].volume,
                            delta: 0,
                            gamma: 0,
                            theta: 0,
                            rho: 0,
                            vega: 0
                        }
                    ) 
                    putsVol.push({
                        strike: strike,
                        volume: response[1].data.result[i].volume
                    })
                }
            }
            exprDate.sort()
            setTicker(props.match.params.ticker.toUpperCase())
            var e = epoch === null ? exprDate[0] : epoch
            setCalls(chain[e].calls.sort((a, b) => (a.strike > b.strike) ? 1 : -1))
            setPuts(chain[e].puts.sort((a, b) => (a.strike > b.strike) ? -1 : 1))
            setCallsVol(callsVol)
            setPutsVol(putsVol)
            var chart = []
            for(var j = 0; j < response[2].data.result.close.length; j++){
                chart.push({
                    time: response[2].data.result.ticks[j]/1000,
                    open: response[2].data.result.open[j],
                    close: response[2].data.result.close[j],
                    high: response[2].data.result.high[j],
                    low: response[2].data.result.low[j]
                })
            }
            setChart(chart)
            dispatch({
                type: "EXPIRATION_DATE",
                exprDate: exprDate
            })
            dispatch({
                type: "CALLS",
                calls: chain[e].calls
            })
            dispatch({
                type: "PUTS",
                puts: chain[e].puts
            })
            dispatch({
                type: "EPOCH",
                epoch: e
            })
        }).then(() => {
            setLoading(false)
        }).catch(error =>{
            console.log(error)
        })
    }

    return(
        <Option updateData={updateData} calls={calls} callsVol={callsVol} 
        puts={puts} putsVol={putsVol} loading={loading}
        ticker={ticker} quote={quote} chart={chart} path={props.match.path}/>
    )
}

export default Crypto