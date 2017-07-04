import * as React from "react"
import * as ReactDOM from "react-dom"
import {App} from "./components/App"
import * as moment from "moment"

moment.locale("en-gb")

ReactDOM.render(
    <App/>,
    document.getElementById("main")
);