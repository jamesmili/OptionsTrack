import {useState, useEffect} from 'react';
import OptionChain from '../components/OptionChain';
import { useDispatch, useSelector } from 'react-redux';

function OptionTable(props){

    const dispatch = useDispatch()
    const epoch = useSelector(state => state.app.epoch)
    const callsPuts = useSelector(state => state.app.callsPuts)
    const exprDate = useSelector(state => state.app.exprDate)
    const calls = useSelector(state => state.app.calls)
    const puts = useSelector(state => state.app.puts)

    let [callsChain, setCallsChain] = useState(calls)
    let [putsChain, setPutsChain] = useState(puts)

    useEffect(() => {
        setCallsChain(calls)
        setPutsChain(puts)
    }, [calls, puts])

    const handleChange = (event) => {
        const epoch = event.target.value
        dispatch({
            type: "EPOCH",
            epoch: epoch
        })
        props.updateData(epoch)
    }

    const convertDate = (epoch) => {
        const date = new Date(epoch*1000 + 1000*60*60*10)
        const expr = date.toLocaleDateString(undefined,  {year: 'numeric', month: 'short', day: 'numeric'})
        return expr
    }

    const handleButton = (event) => {
        if (event.target.outerText === "Calls"){
            dispatch({
                type: "CALLSPUTSBUTTON",
                callsPuts: true
            })
        }else{
            dispatch({
                type: "CALLSPUTSBUTTON",
                callsPuts: false
            })
        }
    }
    return(
        <div className="m-5">
            <div className="flex flex-wrap items-center justify-between">
                <div className="p-5">
                    <button className={"border-2 border-gray-900 rounded-lg font-bold text-gray-200 px-4 py-3 transition duration-300 ease-in-out hover:bg-gray-900 hover:text-white mr-6" + 
                            (callsPuts? " bg-gray-900" : "")}
                        onClick={e => handleButton(e)}>
                        Calls
                    </button>
                    <button className={"border-2 border-gray-900 rounded-lg font-bold text-gray-200 px-4 py-3 transition duration-300 ease-in-out hover:bg-gray-900 hover:text-white mr-6" +
                            (callsPuts ? "" : " bg-gray-900")}
                        onClick={e => handleButton(e)}>
                        Puts
                    </button>
                </div>
                <div className="p-5">
                    <p className="text-sm">Expiration:</p>
                    <select className="border-2 border-gray-900 rounded-lg h-10 text-black pl-2 pr-2"
                        onChange={e => handleChange(e)} 
                        value={epoch ? epoch : exprDate[0]}>
                        {
                            exprDate.map(expirationDate => {
                                const expr = convertDate(expirationDate)
                                return(
                                    <option key={expirationDate} value={expirationDate}>{expr}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto w-full py-5">
            {
                callsPuts ?
                <OptionChain chain={callsChain}/> 
                :
                <OptionChain chain={putsChain}/> 
            }
            </div>
        </div>
    )
}

export default OptionTable;