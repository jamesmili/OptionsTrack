import {useState, useEffect} from 'react'

function Card(props){
    let [header, setHeader] = useState(props.header)
    let [data, setData] = useState(props.data)

    useEffect(() => {
        setHeader(props.header)
        setData(props.data)
    }, [props.header, props.data])
    return(
        <div className="flex-1 px-5 py-3 bg-gray-800 rounded-md my-2 lg:my-0 text-center">
            <div>{header}</div>
            <div>{data}</div>
        </div>
    )
}

export default Card