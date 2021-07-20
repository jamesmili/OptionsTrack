import {useState, useEffect} from 'react';

import OptionTable from './OptionTable';
import { useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchBar from "material-ui-search-bar";
import {Redirect} from 'react-router-dom'
import OpenInterest from './OpenInterest';
import Quote from './Quote';
import Card from './Card';
import VolumeOptionChart from './VolumeOptionChart';

function Option(props){
    let [tickerSearch, setTickerSearch] = useState("")
    let [route, setRoute] = useState(false)
    const dispatch = useDispatch()
    let [tab, setTab] = useState(0)

    const onSearch = (value) => {
        setTickerSearch(value)
        setRoute(true)
        setTab(0)
        dispatch({
            type: "EPOCH",
            epoch: 0
        })
        dispatch({
            type: "CALLSPUTSBUTTON",
            callsPuts: true
        })
    }

    const regMarketPriceChange = () => {
        if (props.quote.regularMarketChange > 0){
            return(
                <p className="mr-4 text-green-400">+{Number(props.quote.regularMarketChange).toFixed(2)}</p>
            )
        }else if (props.quote.regularMarketChange < 0){
            return(
                <p className="mr-4 text-red-400">{Number(props.quote.regularMarketChange).toFixed(2)}</p>
            )                
        }else{
            return(
                <p className="mr-4">{Number(props.quote.regularMarketChange).toFixed(2)}</p>
            )
        }
    }

    const regMarketPriceChangePer = () => {
        if (props.quote.regularMarketChangePercent > 0){
            return(
                <p className="mr-4 text-green-400">+{Number(props.quote.regularMarketChangePercent).toFixed(2)}%</p>
            )
        }else if (props.quote.regularMarketChangePercent < 0){
            return(
                <p className="mr-4 text-red-400">{Number(props.quote.regularMarketChangePercent).toFixed(2)}%</p>
            )
        }else{
            return(
                <p className="mr-4">{Number(props.quote.regularMarketChangePercent).toFixed(2)}%</p>
            )
        }
    }
    const handleButton = (event) => {
        switch(event.target.outerText){
            case "OPTION CHAIN":
                setTab(0)
                break
            case "ANALYTICS":
                setTab(1)
                break
            default:
                setTab(0)
                break
        }
    }
    return(
        <div className="text-gray-300 w-full overflow-auto mt-5 mb-5">
        {
            props.loading ? 
            <div id="loadingContainer">
                <CircularProgress color='inherit'/> 
            </div>
            :
            <div className="xl:ml-20 xl:mr-20 lg:ml-10 lg:ml-10 md:ml-5 md:ml-5 ml-5 mr-5">
                <div className="container mx-auto space-y-5">
                    <div>
                        <div className="flex flex-col lg:flex-row  justify-between items-center">
                            <div>
                                <p className="text-2xl">{props.quote.longName}</p>
                                <p className="text-gray-600">Ticker: ${props.ticker.toUpperCase()}</p>
                            </div>
                            {
                                props.path.includes("crypto") ? <span></span> : 
                                <div>
                                    <SearchBar
                                    onRequestSearch={(v) => onSearch(v.toUpperCase())}
                                    id="searchBar"
                                    placeholder="Search Ticker"
                                    />
                                    {route && <Redirect to={'/stocks/options/'+ tickerSearch} />}   
                                </div>
                            }
                        </div>
                        <div className="my-5 flex-col flex lg:flex-row xl:space-x-5">
                            <Card header={"Current Price:"} data={`$${Number(props.quote.regularMarketPrice).toFixed(2)}`}/>
                            <Card header={"Price Change:"} data={regMarketPriceChange()}/>
                            <Card header={"% Change:"} data={regMarketPriceChangePer()}/>
                            <Card header={"High:"} data={Number(props.quote.regularMarketDayHigh).toFixed(2)}/>
                            <Card header={"Low:"} data={Number(props.quote.regularMarketDayLow).toFixed(2)}/>
                            <Card header={"Volume:"} data={props.quote.regularMarketVolume}/>
                        </div>
                    </div>
                    <Quote data={props.chart}/>
                    <div className="border-b border-gray-800">
                        <nav className="flex flex-col sm:flex-row">
                            <button className={"py-4 px-6 block hover:text-gray-300 text-sm " + 
                                    (tab === 0 ? "outline-none text-gray-300 border-b-2 font-medium border-gray-300" : "text-gray-600")}
                                    onClick={e => handleButton(e)}>
                                OPTION CHAIN
                            </button>
                            <button className={"py-4 px-6 block hover:text-gray-300 text-sm " + 
                                    (tab === 1 ? "outline-none text-gray-300 border-b-2 font-medium border-gray-300" : "text-gray-600")}
                                    onClick={e => handleButton(e)}>
                                ANALYTICS
                            </button>
                        </nav>
                    </div>
                    <div className={"bg-gray-800 rounded-md md:my-3 " + (tab === 0 ? "block" : "hidden")}>
                        <OptionTable updateData={props.updateData}/>
                    </div>
                    <div className={"self-center " + (tab === 1 ? "block" : "hidden")} >
                        <OpenInterest updateData={props.updateData} ticker={props.ticker} calls={props.calls} puts={props.puts}/>
                    </div>
                    <div className={"my-5 flex-col flex lg:flex-row xl:space-x-5 " + (tab === 1 ? "block" : "hidden")}>
                        <VolumeOptionChart datakey={"strike"} xaxis={"Strike Price"} yaxis={"Volume"} 
                                data={props.callsVol} title={"CALL OPTION VOLUME"} colour={"#34D399"}
                                num={1000} symbol={"K"}/>
                        <VolumeOptionChart datakey={"strike"} xaxis={"Strike Price"} yaxis={"Volume"} 
                                data={props.putsVol} title={"PUT OPTION VOLUME"} colour={"#F87171"}
                                num={1000} symbol={"K"}/>
                    </div>
                </div>
            </div>
        }
    </div>
    )
}

export default Option