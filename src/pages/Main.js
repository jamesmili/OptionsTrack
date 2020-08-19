import React from "react"
import { Link } from "gatsby"
import '../styles/styles.css';

class Main extends React.Component{

    render(){
        const ticker = "APPL"
        return (
            <div>
                <h1>Options Track</h1>
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