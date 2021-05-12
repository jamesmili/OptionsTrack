import {useEffect, useState} from 'react';
import axios from "axios";
import { proxyURL, quoteURL } from '../constants/const'
import Card from './Card'
import CircularProgress from '@material-ui/core/CircularProgress';
import ContractChart from './ContractChart'

function Contract(props){
    let [name, setName] = useState("-")
    let [symbol, setSymbol] = useState("-")
    let [price, setPrice] = useState("-")
    let [regularMarketDayLow, setRegularMarketDayLow] = useState("-")
    let [regularMarketDayHigh, setRegularMarketDayHigh] = useState("-")
    let [change, setChange] = useState("-")
    let [changePercent, setChangePercent] = useState("-")
    let [volume, setVolume] = useState("-")
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        getData()
    })

    const getData = () => {
        axios.get(proxyURL + quoteURL + props.match.params.contract, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var date = new Date(response.data.optionChain.result[0].quote.expireIsoDate)
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            var p = response.data.optionChain.result[0].quote.shortName.split(' ')
            var premium = response.data.optionChain.result[0].quote.underlyingSymbol + " " + 
                months[date.getUTCMonth()]+' '+date.getUTCDate()+', '+date.getFullYear() +  " " + 
                Number(p[p.length-2]).toFixed(2) + " " + p[p.length-1]
            setName(premium.toUpperCase())
            setSymbol(response.data.optionChain.result[0].quote.symbol)
            setPrice(response.data.optionChain.result[0].quote.regularMarketPrice)
            setRegularMarketDayHigh(response.data.optionChain.result[0].quote.regularMarketDayHigh)
            setRegularMarketDayLow(response.data.optionChain.result[0].quote.regularMarketDayLow)
            setChange(Number(response.data.optionChain.result[0].quote.regularMarketChange).toFixed(2))
            setChangePercent(Number(response.data.optionChain.result[0].quote.regularMarketChangePercent).toFixed(2))
            setVolume(response.data.optionChain.result[0].quote.regularMarketVolume ? response.data.optionChain.result[0].quote.regularMarketVolume : 0)
        }).then(() => {
            setLoading(false)
        }).catch(error =>{
            console.log(error)
        })
    }
        const regMarketPriceChange = () => {
            if (change > 0){
                return(
                    <p className="mr-4 text-green-400">+{Number(change).toFixed(2)}</p>
                )
            }else if (change < 0){
                return(
                    <p className="mr-4 text-red-400">{Number(change).toFixed(2)}</p>
                )                
            }else{
                return(
                    <p className="mr-4">{Number(change).toFixed(2)}</p>
                )
            }
        }

        const regMarketPriceChangePer = () => {
            if (changePercent > 0){
                return(
                    <p className="mr-4 text-green-400">+{Number(changePercent).toFixed(2)}%</p>
                )
            }else if (changePercent < 0){
                return(
                    <p className="mr-4 text-red-400">{Number(changePercent).toFixed(2)}%</p>
                )
            }else{
                return(
                    <p className="mr-4">{Number(changePercent).toFixed(2)}%</p>
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
                        <p className="text-gray-300 text-2xl">{name}</p>
                        <p className="text-gray-600">{symbol}</p>
                        <div className="my-5 flex-col flex lg:flex-row justify-between xl:space-x-5">
                            <Card header={"Current Price:"} data={`$${Number(price).toFixed(2)}`}/>
                            <Card header={"Price Change:"} data={regMarketPriceChange()}/>
                            <Card header={"% Change:"} data={regMarketPriceChangePer()}/>
                            <Card header={"High:"} data={Number(regularMarketDayHigh).toFixed(2)}/>
                            <Card header={"Low:"} data={Number(regularMarketDayLow).toFixed(2)}/>
                            <Card header={"Volume:"} data={volume}/>
                        </div>
                    </div>                    
                    <ContractChart contract={props.match.params.contract}/>
                </div>
            </div>
        }
        </div>
    )
}

export default Contract