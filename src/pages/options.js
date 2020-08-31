import React from "react"
import { Router } from "@reach/router"
import Option from "./Option"
import Contract from "./Contract"
import Docs from "./docs"

const Routing = () => {
    return(
        <Router>
            <Option path="/options/:ticker"/>
            <Contract path="/options/:ticker/:contract"/>
            <Docs path="/docs"/>
        </Router>
    )
}

export default Routing