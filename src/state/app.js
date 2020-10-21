const initialState = {
    calls: [],
    puts: [],
    exprDate: [],
    epoch: null,
    chain: [],
    callsPuts: true,
    order: 'asc',
    orderBy: 'strike',
    dark: false,
    tab: 0
};
  
export const calls = (c) => ({
    type: 'CALLS',
    calls: c
});

export const puts = (p) => ({
    type: 'PUTS',
    puts: p
});

export const exprDate = (e) => ({
    type: 'EXPIRATION_DATE',
    exprDate: e
});

export const epoch = (e) => ({
    type: 'EPOCH',
    epoch: e
});

export const currTicker = (t) => ({
    type: 'TICKER',
    currTicker: t
})

export const callsPuts = (b) => ({
    type: 'CALLSPUTSBUTTON',
    callsPuts: b
})

export const quote = (q) => ({
    type: "QUOTE",
    quote: q
})

export const contractInfo = (c) => ({
    type: "CONTRACT_INFO",
    contractInfo: c
})

export const order = (o) => ({
    type: "ORDER",
    order: o
})

export const orderBy = (ob) => ({
    type: "ORDERBY",
    orderBy: ob
})

export const darkMode = (d) => ({
    type: "DARKMODE",
    dark: d
})

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CALLS':
            return {
                ...state,
                calls: action.calls
            }
        case 'PUTS':
            return {
                ...state,
                puts: action.puts
            }
        case 'EXPIRATION_DATE':
            return {
                ...state,
                exprDate: action.exprDate
            }
        case 'EPOCH':
            return {
                ...state,
                epoch: action.epoch
            }
        case 'TICKER':
            return {
                ...state,
                currTicker: action.currTicker
            }
        case 'CALLSPUTSBUTTON':
            return{
                ...state,
                callsPuts: action.callsPuts
            }
        case 'QUOTE':
            return{
                ...state,
                quote: action.quote
            }
        case 'CONTRACT_INFO':
            return{
                ...state,
                contractInfo: action.contractInfo
            }
        case 'ORDER':
            return{
                ...state,
                order: action.order
            }
        case 'ORDERBY':
            return{
                ...state,
                orderBy: action.orderBy
            }
        case 'DARKMODE':
            return{
                ...state,
                dark: action.dark
            }
        default:
            return {
                ...state
            }
    }
}