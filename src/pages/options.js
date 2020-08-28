import React from "react"
import { Router } from "@reach/router"
import Option from "./Option"
import Contract from "./Contract"

const Routing = () => {
    return(
        <Router>
            <Option path="/options/:ticker"/>
            <Contract path="/options/:ticker/:contract"/>
        </Router>
    )
}

export default Routing