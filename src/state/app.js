const initialState = {
    calls: [],
    puts: [],
    exprDate: [],
    epoch: null
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
        default:
            return {
                ...state
            }
    }
}