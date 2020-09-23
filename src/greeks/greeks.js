import { BSHolder, BS } from '../greeks/BlackScholes'; 

export default function greeks(op, call, date, marketPrice){
    var x = op.strike
    var r = 0.02
    var sigma = op.impliedVolatility
    /* add 72000 for market close time*/
    var expirationDate= new Date(date + 72000)
    var currentDate = new Date()
    var timeDiff = expirationDate.getTime() - currentDate.getTime()/1000; 
    var days = timeDiff / (60 * 60 * 24 * 365)
    let greek = new BSHolder(marketPrice,x,r,sigma,days)
    if (call){
        var c = [ BS.cdelta(greek).toFixed(5), BS.gamma(greek).toFixed(5), 
                BS.ctheta(greek).toFixed(5), BS.crho(greek).toFixed(5), BS.vega(greek).toFixed(5)]
        return c
    }else{
        var p = [ BS.pdelta(greek).toFixed(5), BS.gamma(greek).toFixed(5),
                BS.ptheta(greek).toFixed(5), BS.prho(greek).toFixed(5), BS.vega(greek).toFixed(5)]
        return p
    }
}
