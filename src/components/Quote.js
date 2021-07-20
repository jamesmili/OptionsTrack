import Chart from 'kaktana-react-lightweight-charts'

function Quote(props){
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

    return(
        <Chart options={options} candlestickSeries={[ {data: props.data}]} autoWidth height={320}/>
    )
}

export default Quote;