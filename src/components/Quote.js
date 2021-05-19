import {useState, useEffect} from 'react'
import axios from "axios";
import { proxyURL, chartURL } from '../constants/const';
import { useSelector } from 'react-redux';
import Chart from 'kaktana-react-lightweight-charts'

function Quote(props){
    let [data, setData] = useState([])
    const period = useSelector(state => state.app.period)

    useEffect(()=>{
        getData(period)
        return(()=>{
            setData([])
        })
    }, [props.ticker])

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

    const getData = (period) => {
        var p1
        var p = period - 15634807
        p1 = "?period1=" + p + "&"
        axios.get(proxyURL + chartURL + props.ticker + p1 + "&period2=9999999999&interval=" + "1h", {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var o,c,h,l = 0.00
            setData(response.data.chart.result[0].timestamp.map((d,index) => {
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
    return(
        <Chart options={options} candlestickSeries={[ {data: data}]} autoWidth height={320}/>
    )
}

export default Quote;