import { createStore, combineReducers} from 'redux';
import actionReducer from '../actionReducer/actionReducer';

var store = () => {

    const store = createStore(
      combineReducers(
        { app: actionReducer },
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
}

export default store;