import React from "react"
import { navigate } from "gatsby"
import Header from '../components/Header'

class Main extends React.Component{
    componendDidMount(){
        navigate('/options/TSLA')
    }
    render(){
        return (
            <div>
                <Header/>
            </div>
        )
    }
}

export default Main;