import {useState, useEffect} from 'react'
import axios from "axios";
import ContractInfo from './ContractInfo';
import CircularProgress from '@material-ui/core/CircularProgress';
import { proxyURL, chartURL } from '../constants/const';
import Chart from 'kaktana-react-lightweight-charts'

function Contract(props){
    let [loading, setLoading] = useState(true)
    let [data, setData] = useState([])
    
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

    const getData = async (period, period2, interval)=>{
        var p1
        var p = period - 2592338
        p1 = "?period1=" + p + "&"
        await axios.get(proxyURL + chartURL + props.match.params.contract + p1 + "period2=" + period2 + "&interval=" + "2m", {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers' : 'access-control-allow-origin',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            var o,h,l,c = 0.00
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
        }).then(() => {
            setLoading(false)
        }).catch(error =>{
            console.log(error)
        })
    }

    useEffect(() => {
        var period = new Date().setHours(0,0,0,0)/1000 + 60*60*9.5
        var period2 = period + 60*60*6.5
        var interval = "2m"
        getData(period, period2, interval)
    }, [])

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
                    <ContractInfo ticker={props.match.params.ticker}
                        contract={props.match.params.contract}
                        history={props.history}/>                        
                    <Chart options={options} candlestickSeries={[ {data: data}]} autoWidth/>
                </div>
            </div>
        }
        </div>
    )
}

export default Contract