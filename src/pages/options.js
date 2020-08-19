import React from "react"
import { Router } from "@reach/router"
import Main from "./Main"
import Option from "./Option"

const Routing = () => {
    return(
        <Router>
            <Main path="/"/>
            <Option path="/options/:ticker"/>
        </Router>
    )
}

export default Routing