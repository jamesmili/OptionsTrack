import {useState, useEffect} from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function VolumeOptionChart(props){
    let [title, setTitle] = useState(props.title)
    let [data, setData] = useState(props.data)
    let [colour, setColour] = useState(props.colour)

    useEffect(()=>{
        setTitle(props.title)
        setData(props.data)
        setColour(props.colour)
    }, [props.data, props.title, props.colour])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 rounded-md md:my-3 p-5">
                    <p>Strike: ${label}</p>
                    <p>Volume: {payload[0].value}</p>
                </div>
            )
        }
        return null;
    }

    const formatYAxis = (tickItem) => {
        return (tickItem/1000).toString()+"K"
    }

    return(
        <div className="w-full px-4 py-2 lg:px-6 lg:py-4 bg-gray-800 rounded-md my-2 lg:my-0 space-y-5 overflow-scroll">
            <div className="my-2">
                <h1>{title}</h1>
                <p className="text-gray-500 text-sm">Volume Chart</p>
            </div>
            <ResponsiveContainer width='100%' height={200}>
                <AreaChart data={data}>
                    <XAxis dataKey="strike" stroke="#9CA3AF" height={60} 
                        tick={{ fontSize: 12}}
                        label={{ value: "STRIKE PRICE", position: "insideBottom", dy: -10, fill: "#9CA3AF", fontSize: 12}}/>
                    <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} tickCount={10}
                        tick={{ fontSize: 12}}
                        label={{ value: "VOLUME", position: "insideLeft", angle: -90, fill: "#9CA3AF", fontSize: 12}}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="volume" stroke={colour} fill={colour} />
                </AreaChart>      
            </ResponsiveContainer>          
        </div>
    )
}

export default VolumeOptionChart