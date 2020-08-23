import React from "react"
import { Link } from "gatsby"
import '../styles/styles.css';
import Header from '../components/Header'

class Main extends React.Component{

    render(){
        const ticker = "AAPL"
        return (
            <div>
                <Header/>
                <Link to={`/options/${ticker}`}>
                    <span>
                        {ticker}
                    </span>
                </Link>
            </div>
        )
    }
}

export default Main;