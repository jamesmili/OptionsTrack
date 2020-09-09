module.exports = {
    plugins: [{
    resolve: 'gatsby-source-custom-api',
    options: {
        url: 'https://query2.finance.yahoo.com/v7/finance/options/TSLA',
        rootKey: 'optionChain',
        schemas:{
            optionChain:
                `result: [data]
                 error: String
                `,
            data:
                `underlyingSymbol: String
                expirationDate: [Int]
                strikes: [Float]
                hasMiniOptions: Boolean
                quote: Quote
                options: [Options]
                `,
            Quote:
                `language: String
                region: String
                quoteType: String
                quoteSourceName: String
                triggerable: Boolean
                currency: String
                regularMarketChange: Float
                regularMarketChangePercent: Float
                regularMarketTime: Int
                regularMarketPrice: Float
                regularMarketDayHigh: Float
                regularMarketDayRange: String
                regularMarketDayLow: Float
                regularMarketVolume: Int
                regularMarketPreviousClose: Float
                marketState: String
                exchange: String
                shortName: String
                longName: String
                messageBoardId: String
                exchangeTimezoneName: String
                exchangeTimezoneShortName: String
                gmtOffSetMilliseconds: Int
                market: String
                esgPopulated: Boolean
                bid: Float
                ask: Float
                bidSize: Int
                askSize: Int
                fullExchangeName: String
                financialCurrency: String
                regularMarketOpen: Float
                averageDailyVolume3Month: Int
                averageDailyVolume10Day: Int
                fiftyTwoWeekLowChange: Float
                fiftyTwoWeekLowChangePercent: Float
                fiftyTwoWeekRange: String
                fiftyTwoWeekHighChange: Float
                fiftyTwoWeekHighChangePercent: Float
                fiftyTwoWeekLow: Float
                fiftyTwoWeekHigh: Float
                dividendDate: Int
                earningsTimestamp: Int
                earningsTimestampStart: Int
                earningsTimestampEnd: Int
                trailingAnnualDividendRate: Float
                trailingPE: Float
                trailingAnnualDividendYield: Float
                epsTrailingTwelveMonths: Float
                epsForward: Float
                epsCurrentYear: Float
                priceEpsCurrentYear: Float
                sharesOutstanding: Int
                bookValue: Float
                fiftyDayAverage: Float
                fiftyDayAverageChange: Float
                fiftyDayAverageChangePercent: Float
                twoHundredDayAverage: Float
                twoHundredDayAverageChange: Float
                twoHundredDayAverageChangePercent: Float
                marketCap: Int
                forwardPE: Float
                priceToBook: Float
                sourceInterval: Int
                exchangeDataDelayedBy: Int
                tradeable: Boolean
                firstTradeDateMilliseconds: Int
                priceHint: Int
                displayName: String
                symbol: String
                `,
            Options: 
                `expirationDate: Int
                hasMiniOptions: Boolean
                calls: [Type]
                puts: [Type]
                `,
            Type:
                `contractSymbol: String,
                strike: Float,
                currency: String,
                lastPrice: Float,
                change: Float,
                percentChange: Float,
                volume: Int,
                openInterest: Int,
                bid: Float,
                ask: Float,
                contractSize: String,
                expiration: Int,
                lastTradeDate: Int,
                impliedVolatility: Float,
                inTheMoney: Boolean
                `
        }
    }
    }],
}