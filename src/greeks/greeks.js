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
        var c = [ BS.cdelta(greek).toFixed(3), BS.gamma(greek).toFixed(4), 
                BS.ctheta(greek).toFixed(3), BS.crho(greek).toFixed(3), BS.vega(greek).toFixed(3)]
        return c
    }else{
        var p = [ BS.pdelta(greek).toFixed(3), BS.gamma(greek).toFixed(3),
                BS.ptheta(greek).toFixed(3), BS.prho(greek).toFixed(4), BS.vega(greek).toFixed(3)]
        return p
    }
}
