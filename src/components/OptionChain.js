import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function OptionChain(props){

    let [chain, setChain] = useState(props.chain)
    const currTicker = useSelector(state => state.app.currTicker)

    useEffect(()=>{
        setChain(props.chain)
    }, [props.chain])

    const strike = (item) => {
        if (item.inTheMoney) {
            return(
                <div className="border-l-4 border-green-400 p-4">
                    <Link to={`/options/${currTicker}/${item.contractSymbol}`} className="hover:underline">
                        {Number(item.strike).toFixed(2)}
                    </Link>
                </div>
            )
        }else{
            return(
                <div className="border-l-4 border-red-400 p-4">
                    <Link to={`/options/${currTicker}/${item.contractSymbol}`} className="hover:underline">
                        {Number(item.strike).toFixed(2)}
                    </Link>
                </div>
            )
        }
    }
    const change = (change) => {
        if (change > 0){
            return(
                <div className="bg-green-400 text-center">
                    <p className="text-black">{Number(change).toFixed(2)}</p>
                </div>
            )
        }else if (change < 0){
            return(
                <div className="bg-red-400 text-center">
                    <p className="text-black">{Number(change).toFixed(2)}</p>
                </div>
            ) 
        }
        else{
            return(
                <div className="text-center">
                    <p>-</p>
                </div>
            ) 
        }
    }
    const changePercent = (changePer) => {
        if (changePer > 0){
            return(
                <div className="bg-green-400 text-center">
                    <p className="text-black">{Number(changePer).toFixed(2)}%</p>
                </div>
            )
        }else if (changePer < 0){
            return(
                <div className="bg-red-400 text-center">
                    <p className="text-black">{Number(changePer).toFixed(2)}%</p>
                </div>
            ) 
        }else{
            return(
                <div className="text-center">
                    <p>-</p>
                </div>
            ) 
        }
    }
    
    return(
        <table className="w-full">
            <thead className="bg-gray-900">
                <tr>
                    <th className="p-2">Strike</th>
                    <th className="p-2">Last</th>
                    <th className="p-2">Ask</th>
                    <th className="p-2">Bid</th>
                    <th className="p-2">Delta</th>
                    <th className="p-2">Gamma</th>
                    <th className="p-2">Theta</th>
                    <th className="p-2">Rho</th>
                    <th className="p-2">Vega</th>
                    <th className="p-2">Change</th>
                    <th className="p-2">%Change</th>
                    <th className="p-2">Volume</th>
                    <th className="p-2">O.I.</th>
                    <th className="p-2">I.V.</th>
                </tr>
            </thead>
            <tbody>
                {
                    chain.map(item => {
                        return(
                            <tr className="border-b border-gray-900 text-center font-medium" key={item.strike}>
                                <td className="px-2">{strike(item)}</td>
                                <td className="px-2">{Number(item.lastPrice ? item.lastPrice : 0).toFixed(2)}</td>
                                <td className="px-2">{Number(item.ask ? item.ask : 0).toFixed(2)}</td>
                                <td className="px-2">{Number(item.bid ? item.bid : 0).toFixed(2)}</td>
                                <td className="px-2">{Number(item.delta ? item.delta : 0).toFixed(2)}</td>
                                <td className="px-2">{Number(item.gamma ? item.gamma : 0).toFixed(5)}</td>
                                <td className="px-2">{Number(item.theta ? item.theta : 0).toFixed(2)}</td>
                                <td className="px-2">{Number(item.rho ? item.rho : 0).toFixed(2)}</td>
                                <td className="px-2">{Number(item.vega ? item.vega : 0).toFixed(2)}</td>
                                <td className="px-2">{change(item.change ? item.change : 0)}</td>
                                <td className="px-2">{changePercent(item.percentChange ? item.percentChange : 0)}</td>
                                <td className="px-2">{Number(item.volume ? item.volume : 0)}</td>
                                <td className="px-2">{Number(item.openInterest ? item.openInterest : 0)}</td>
                                <td className="px-2">{Number(item.impliedVolatility ? item.impliedVolatility*100 : 0).toFixed(2)}%</td>
                            </tr>
                        )
                    })    
                }
            </tbody>
        </table>
    )
}

export default OptionChain;