const initialState = {
    calls: [],
    puts: [],
    exprDate: [],
    epoch: null,
    chain: [],
    callsPutsButton: true
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

export const callsPutsButton = (b) => ({
    type: 'CALLSPUTSBUTTON',
    callsPuts: b
})

export const quote = (q) => ({
    type: "QUOTE",
    quote: q
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
        default:
            return {
                ...state
            }
    }
}