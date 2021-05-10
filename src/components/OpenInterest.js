import React, {useState, useEffect} from 'react';
import { ComposedChart, XAxis, YAxis, Tooltip, Bar, Legend, ResponsiveContainer} from 'recharts';
import Card from './Card'

function OpenInterest(props){

    let [data, setData] = useState([])
    let [calls, setCalls] = useState(0)
    let [puts, setPuts] = useState(0)
    let [maxPain, setMaxPain] = useState(0)

    useEffect(() => {
        var calls = props.calls
        var puts = props.puts
        var data1 = []
        var data2 = []
        var data = []
        var c = 0
        var p = 0
        var maxPain = Infinity
        var maxPainStrike = 0
        for (var i = 0; i < calls.length; i++){
            if (calls[i])
            {
                data1.push({
                    "strike": Number(calls[i].strike).toFixed(2),
                    "Calls": calls[i].openInterest,
                    "callPrice": calls[i].lastPrice,
                    "cITM": calls[i].inTheMoney
                })
                c += calls[i].openInterest ? calls[i].openInterest : 0
            }
        }
        for (var j = 0; j < puts.length; j++){
            if (puts[j])
            {
                data2.push({
                    "strike": Number(puts[j].strike).toFixed(2),
                    "Puts": puts[j].openInterest,
                    "putPrice": puts[j].lastPrice,
                    "pITM": puts[j].inTheMoney
                })
                p += puts[j].openInterest ? puts[j].openInterest : 0
            }
        }    
        for (var k = 0; k < data1.length; k++){
            var obj = data2.find(e => e.strike === data1[k].strike)
            if (obj){
                data.push({
                    "strike": data1[k].strike,
                    "Calls": data1[k].Calls,
                    "callPrice": data1[k].callPrice,
                    "cITM": data1[k].cITM,
                    "Puts": obj.Puts,
                    "putPrice": obj.putPrice,
                    "pITM": obj.pITM
                })
            }
        }
        for (var close = 0; close < data.length; close++){
            var strike = 0
            var sumPut = 0
            var sumCall = 0
            while (strike < data.length){
                if (strike < close){
                    sumCall += (Number(data[close].strike) - Number(data[strike].strike)) * data[strike].Calls * 100
                }else if (strike > close){
                    sumPut += (Number(data[strike].strike) - Number(data[close].strike)) * data[strike].Puts * 100
                }
                strike += 1
            }
            data[close]['Value'] = sumPut + sumCall
            data[close]['Put'] = sumPut
            data[close]['Call'] = sumCall
            if(data[close].Value < maxPain){
                maxPainStrike = data[close].strike
                maxPain = data[close].Value
            }
        }
        setData(data)
        setCalls(c)
        setPuts(p)
        setMaxPain(maxPainStrike)
    }, [props])

    const valYAxis = (tickItem) => {
        return (tickItem/1000000).toString()+"M"
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 rounded-md md:my-3 p-5">
                    <p>Strike: ${label}</p>
                    <p>Calls: {payload[0].payload.Calls}</p>
                    <p>Puts: {payload[0].payload.Puts}</p>
                    <p>Value in USD: ${payload[0].payload.Value}</p>
                </div>
            )
        }
        return null;
    }
    return(
        <div>
            <div className="my-5 flex-col flex lg:flex-row xl:space-x-5">
                <Card header={"Calls:"} data={calls}/>
                <Card header={"Puts:"} data={puts}/>
                <Card header={"Total:"} data={calls+puts}/>
                <Card header={"Calls/Puts Ratio:"} data={Number(calls/puts).toFixed(2)}/>
                <Card header={"Max Pain:"} data={maxPain}/>
            </div>
            <div className="px-4 py-2 lg:px-6 lg:py-4 bg-gray-800 rounded-md my-2 lg:my-0 space-y-4 overflow-scroll">
                <div>
                    <h1 className="text-xl">MAX PAIN</h1>
                    <p className="text-gray-500 text-sm">Total value of all put and call options when they expire at a specific strike price.</p>
                </div>
                <ResponsiveContainer width='100%' height={500} >
                    <ComposedChart 
                        data={data}
                        barGap={0}>
                        <XAxis dataKey="strike" stroke="#9CA3AF" height={80}
                            tick={{ fontSize: 12}}
                            label={{ value: "STRIKE PRICE", position: "insideBottom", dy: -15, fill: "#9CA3AF", fontSize: 12}}/>
                        <YAxis yAxisId="left" stroke="#9CA3AF" orientation="left" width={90} tickFormatter={valYAxis} 
                            tick={{ fontSize: 12}}
                            label={{ value: "TOTAL VALUE (USD)", position: "insideLeft", angle: -90, fill: "#9CA3AF", fontSize: 12}}/>
                        <Tooltip content={<CustomTooltip />}/>
                        <Legend layout="horizontal" verticalAlign="top" />
                        <Bar yAxisId="left" dataKey="Call" fill="#34D399" />
                        <Bar yAxisId="left" dataKey="Put" fill="#F87171" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default OpenInterest