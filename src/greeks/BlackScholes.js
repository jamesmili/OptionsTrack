//The MIT License (MIT)
//
//Copyright (c) 2014 Stefano Paggi
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.


export var NormalD = {
    /**
     * from http://www.math.ucla.edu/~tom/distributions/normal.html
     * @param {Number} X 
     * @returns {Number|NormalD.normalcdf.D|NormalD.normalcdf.T}
     */
    normalcdf: function(X) {   //HASTINGS.  MAX ERROR = .000001
        var T = 1 / (1 + .2316419 * Math.abs(X));
        var D = .3989423 * Math.exp(-X * X / 2);
        var Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
        if (X > 0) {
            Prob = 1 - Prob;
        }
        return Prob;
    },
    /**
     * from http://www.math.ucla.edu/~tom/distributions/normal.html
     * @param {Number} Z x-Value
     * @param {Number} M mean (µ) 
     * @param {Number} SD standard deviation
     * @returns {Number|@exp;normalcdf@pro;Prob|@exp;normalcdf@pro;D|@exp;normalcdf@pro;T|normalcdf.Prob|@exp;Math@call;exp|normalcdf.D|@exp;Math@call;abs|normalcdf.T}
     */
    compute: function(Z, M, SD) {
        var Prob;
        if (SD < 0) {
            console.log("normal", "The standard deviation must be nonnegative.");
        } else if (SD === 0) {
            if (Z < M) {
                Prob = 0;
            } else {
                Prob = 1;
            }
        } else {
            Prob = NormalD.normalcdf((Z - M) / SD);
            Prob = Math.round(100000 * Prob) / 100000;
        }

        return Prob;
    },
    /**
     * standard normal distribution.
     * @param {Number} Z x-Value
     * @returns {Number|normalcdf.D|normalcdf.T|normalcdf.Prob}
     */
    stdcompute: function(Z) {
        return NormalD.compute(Z, 0, 1);
    },
    /**
     * standard density function
     * @param {type} x Value
     * @returns {Number}
     */
    stdpdf: function(x) {
        var m = Math.sqrt(2 * Math.PI);
        var e = Math.exp(-Math.pow(x, 2) / 2);
        return e / m;
    }
};
/**
 * Call: C = S * N(d1) - K * exp (-rt) * N(d2)
 * Put: P = K * exp (-rt) * N(-d2) - S * N(-d1)
 * @type type
 */
export var BS = {
    /**
     * 
     * 
     * @param {BSHolder} BSHolder Holder der BS-Variablen
     * @returns {Number|normalcdf.D|normalcdf.T|normalcdf.Prob} Fairen Preis
     */
    call: function(BSHolder)
    {

        var d1 = (Math.log(BSHolder.stock / BSHolder.strike) + (BSHolder.interest + .5 * Math.pow(BSHolder.vola, 2)) * BSHolder.term) / (BSHolder.vola * Math.sqrt(BSHolder.term));
        var d2 = d1 - (BSHolder.vola * Math.sqrt(BSHolder.term));
        var res = Math.round((BSHolder.stock * NormalD.stdcompute(d1) - BSHolder.strike * Math.exp(-BSHolder.interest * BSHolder.term) * NormalD.stdcompute(d2)) * 100) / 100;
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    /**
     * 
     * 
     * @param {BSHolder} BSHolder Holder der BS-Variablen
     * @returns {Number|normalcdf.D|normalcdf.T|normalcdf.Prob} Fairen Preis
     */
    put: function(BSHolder)
    {
        var d1 = (Math.log(BSHolder.stock / BSHolder.strike) + (BSHolder.interest + .5 * Math.pow(BSHolder.vola, 2)) * BSHolder.term) / (BSHolder.vola * Math.sqrt(BSHolder.term));
        var d2 = d1 - (BSHolder.vola * Math.sqrt(BSHolder.term));
        var res = Math.round((BSHolder.strike * Math.pow(Math.E, -BSHolder.interest * BSHolder.term) * NormalD.stdcompute(-d2) - BSHolder.stock * NormalD.stdcompute(-d1)) * 100) / 100;
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    cdelta: function(h)
    {

        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var res = Math.max(NormalD.stdcompute(d1), 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    pdelta: function(h)
    {

        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var res = Math.min(NormalD.stdcompute(d1) - 1, 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    gamma: function(h)
    {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var phi = NormalD.stdpdf(d1);
        var res = Math.max(phi / (h.stock * h.vola * Math.sqrt(h.term)), 0);
        ;
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    vega: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var phi = NormalD.stdpdf(d1);
        var res = Math.max(h.stock * phi * Math.sqrt(h.term), 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;

    },
    ctheta: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var d2 = d1 - (h.vola * Math.sqrt(h.term));
        var phi = NormalD.stdpdf(d1);
        var s = -(h.stock * phi * h.vola) / (2 * Math.sqrt(h.term));
        var k = h.interest * h.strike * Math.exp(-h.interest * h.term) * NormalD.normalcdf(d2);
        var res = Math.min(s - k, 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    ptheta: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var d2 = d1 - (h.vola * Math.sqrt(h.term));
        var phi = NormalD.stdpdf(d1);
        var s = -(h.stock * phi * h.vola) / (2 * Math.sqrt(h.term));
        var k = h.interest * h.strike * Math.exp(-h.interest * h.term) * NormalD.normalcdf(-d2);
        var res = Math.min(s + k, 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    crho: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var nd2 = NormalD.normalcdf(d1 - (h.vola * Math.sqrt(h.term)));
        var res = Math.max(h.term * h.strike * Math.exp(-h.interest * h.term) * nd2, 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    prho: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var nnd2 = NormalD.normalcdf(-(d1 - (h.vola * Math.sqrt(h.term))));
        var res = Math.min(-h.term * h.strike * Math.exp(-h.interest * h.term) * nnd2, 0);
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    comega: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var nd2 = NormalD.normalcdf(d1 - (h.vola * Math.sqrt(h.term)));
        var res = nd2 * (h.stock / BS.call(h));
        if (isNaN(res)) {
            return 0;
        }
        return res;
    },
    pomega: function(h) {
        var d1 = (Math.log(h.stock / h.strike) + (h.interest + .5 * Math.pow(h.vola, 2)) * h.term) / (h.vola * Math.sqrt(h.term));
        var nd2 = NormalD.normalcdf(d1 - (h.vola * Math.sqrt(h.term)));
        var res = (nd2 - 1) * (h.stock / BS.put(h));
        if (isNaN(res)) {
            return 0;
        }
        return res;
    }
};
var graph = {
};
/**
 * Behälter für die BlackScholes Variablen
 * 
 * @param {Float} stock underlying's asset price
 * @param {Float} strike strike price
 * @param {Float} interest annualized risk-free interest rate
 * @param {Float} vola volatility
 * @param {Float} term a time in years
 * @returns {BSHolder}
 */
export function BSHolder(
        stock,
        strike,
        interest,
        vola,
        term)
{
    this.stock = Math.max(stock, 0);
    this.strike = Math.max(strike, 0);
    this.interest = Math.max(interest, 0);
    this.vola = Math.max(vola, 0);
    this.term = Math.max(term, 0);

    this.setStock = function(s) {
        if (typeof s === 'undefined') {
            return this.stock;
        } else {
            this.stock = Math.max(s, 0);
            return this;
        }
    };

    this.setStrike = function(s) {
        if (typeof s === 'undefined') {
            return this.strike;
        } else {
            this.strike = Math.max(s, 0);
            return this;
        }
    };
    this.setInterest = function(s) {
        if (typeof s === 'undefined') {
            return this.interest;
        } else {
            this.interest = Math.max(s, 0);
            return this;
        }
    };
    this.setVola = function(s) {
        if (typeof s === 'undefined') {
            return this.vola;
        } else {
            this.vola = Math.max(s, 0);
            return this;
        }
    };
    this.setTerm = function(s) {
        if (typeof s === 'undefined') {
            return this.term;
        } else {
            this.term = Math.max(s, 0);
            return this;
        }
    };

}
;