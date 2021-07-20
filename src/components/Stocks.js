import {useState, useEffect} from 'react';
import axios from "axios";

import greeks from '../greeks/greeks';
import { useDispatch, useSelector } from 'react-redux';
import { proxyURL, quoteURL, chartURL } from '../constants/const'
import Option from './Option'

function Stocks(props){

    let [callsVol, setCallsVol] = useState([])
    let [putsVol, setPutsVol] = useState([])
    let [calls, setCalls] = useState([])
    let [puts, setPuts] = useState([])
    let [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    let [quote, setQuote] = useState({})
    let [ticker, setTicker] = useState("")
    let [chart, setChart] = useState([])
    const epoch = useSelector(state => state.app.epoch)
    const period = useSelector(state => state.app.period)

    useEffect(() => {
        if (props.match.params.ticker !== ticker){
            updateData(epoch)
        }
    },[props.match.params.ticker, ticker, epoch])

    useEffect(() => {
        if (props.match.params.ticker !== ticker){
            getData(period)
        }
    }, [props.match.params.ticker, ticker])

    const getData = (period) => {
        var p1
        var p = period - 15634807
        p1 = "?period1=" + p + "&"
        axios.get(`${proxyURL+chartURL+props.match.params.ticker+p1}&period2=9999999999&interval=1h`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var o,c,h,l = 0.00
            setChart(response.data.chart.result[0].timestamp.map((d,index) => {
                if (response.data.chart.result[0].indicators.quote[0].close[index]){
                    o = Number(response.data.chart.result[0].indicators.quote[0].open[index].toFixed(2))
                    h = Number(response.data.chart.result[0].indicators.quote[0].high[index].toFixed(2))
                    l = Number(response.data.chart.result[0].indicators.quote[0].low[index].toFixed(2))
                    c = Number(response.data.chart.result[0].indicators.quote[0].close[index].toFixed(2))
                    
                }
                return {
                    time: d,
                    open: o,
                    high: h,
                    low: l,
                    close: c

                }
            }))
        }).catch(error =>{
            console.log(error)
        })
    }

    const updateData = (epoch) => {
        const e = epoch ? "?date=" + epoch : ""
        axios.get(proxyURL + quoteURL + props.match.params.ticker + e, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            let calls = []
            let puts = []
            setQuote(response.data.optionChain.result[0].quote)
            setTicker(props.match.params.ticker)
            if (epoch < 1){
                dispatch({
                    type: "EPOCH",
                    epoch: response.data.optionChain.result[0].options[0].expirationDate
                })
            }
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
                    var x = greeks(op, true, epoch, quote.regularMarketPrice)
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
                    var x = greeks(op, true, epoch, quote.regularMarketPrice)
                    op['delta'] = x[0] === 0 ? 0 : -x[0]
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
    return(
       <Option updateData={updateData} calls={calls} callsVol={callsVol} 
            puts={puts} putsVol={putsVol} loading={loading}
            ticker={ticker} quote={quote} chart={chart} path={props.match.path}/>
    )
}

export default Stocks