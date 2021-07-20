import {useState, useEffect} from 'react'
import axios from "axios";
import { proxyURL, chartURL } from '../constants/const';
import Chart from 'kaktana-react-lightweight-charts'
import VolumeOptionChart from './VolumeOptionChart'

function ContractChart(props){
    let [data, setData] = useState([])
    let [volume, setVolume] = useState([])
    
    const options = {
        layout: {
            backgroundColor: "#253248",
            textColor: "rgba(255, 255, 255, 0.9)"
          },
          grid: {
            vertLines: {
              color: "#334158"
            },
            horzLines: {
              color: "#334158"
            }
          },
          priceScale: {
            borderColor: "#485c7b"
          },
          timeScale: {
            borderColor: "#485c7b",
            rightOffset: 12,
            barSpacing: 3,
            fixLeftEdge: true,
            lockVisibleTimeRangeOnResize: true,
            rightBarStaysOnScroll: true,
            borderVisible: false,
            visible: true,
            timeVisible: true,
            secondsVisible: false
          }
    }

    const getData = (period, period2)=>{
        var p1
        var p = period - 2592338
        p1 = "?period1=" + p + "&"
        axios.get(proxyURL + chartURL + props.contract + p1 + "period2=" + period2 + "&interval=" + "2m", {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var o,h,l,c,v = 0.00
            var vol = []
            var data = []
            
            response.data.chart.result[0].timestamp.map((d,index) => {
                if (response.data.chart.result[0].indicators.quote[0].volume[index]){
                    vol.push({
                        date : convertDate(d),
                        volume: response.data.chart.result[0].indicators.quote[0].volume[index] ? 
                        response.data.chart.result[0].indicators.quote[0].volume[index] : 0
                    })
                }
                if (response.data.chart.result[0].indicators.quote[0].open[index]&&
                    response.data.chart.result[0].indicators.quote[0].close[index]&&
                    response.data.chart.result[0].indicators.quote[0].high[index]&&
                    response.data.chart.result[0].indicators.quote[0].low[index]&&
                    response.data.chart.result[0].indicators.quote[0].close[index]){
                    o = Number(response.data.chart.result[0].indicators.quote[0].open[index].toFixed(2))
                    h = Number(response.data.chart.result[0].indicators.quote[0].high[index].toFixed(2))
                    l = Number(response.data.chart.result[0].indicators.quote[0].low[index].toFixed(2))
                    c = Number(response.data.chart.result[0].indicators.quote[0].close[index].toFixed(2))
                    data.push({
                        time: d,
                        open: o,
                        high: h,
                        low: l,
                        close: c
                    })
                }
            })
            setData(data)
            setVolume(vol)

        }).catch(error =>{
            console.log(error)
        })
    }

    const convertDate = (epoch) => {
        const date = new Date(epoch*1000)
        return date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'} )
    }
    
    useEffect(() => {
        var period = new Date().setHours(0,0,0,0)/1000 + 60*60*9.5
        var period2 = period + 60*60*6.5
        var interval = "2m"
        getData(period, period2, interval)
    }, [])

    return(     
        <div className="space-y-5">
            <Chart options={options} candlestickSeries={[ {data: data}]} autoWidth/>
            <VolumeOptionChart datakey={"date"} xaxis={"Date"} yaxis={"Volume"} 
                    data={volume} title={props.contract + " Volume"} colour={"#93C5FD"}
                    num={1} symbol={""}/>
        </div>            
    )
}

export default ContractChart