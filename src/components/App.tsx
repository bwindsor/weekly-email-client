import * as React from "react"
import AppState, {CreateDefaultTraining} from "../common/AppState"
import EditTraining from "./EditTraining"

import 'react-datepicker/dist/react-datepicker.css';

export class App extends React.Component<undefined, AppState> {
    constructor(props : any) {
        super(props);
        this.state = {
            trainings: [ CreateDefaultTraining() ],
            currentTraining: 0
        }
    }

    render() {
        return (
            <EditTraining  training={this.state.trainings[this.state.currentTraining]}/>
        );
    }
}