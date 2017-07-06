import * as React from "react"
import AppState, {CreateDefaultTraining, TrainingSubset} from "../common/AppState"
import EditTraining from "./EditTraining"

import 'react-datepicker/dist/react-datepicker.css';

export class App extends React.Component<undefined, AppState> {
    constructor(props : any) {
        super(props);
        let defaultTraining = CreateDefaultTraining()
        this.state = {
            trainings: [ defaultTraining ],
            currentTraining: 0
        }
    }

    onEditUpdate(stateDiff: TrainingSubset) : void {
        this.setState((prevState, props) => {
            let t = prevState.trainings.slice();
            t[prevState.currentTraining] = {...t[prevState.currentTraining], ...stateDiff}
            return {
                trainings: t,
                currentTraining: prevState.currentTraining
            }
        })
    }

    render() {
        return (
            <EditTraining 
                training={this.state.trainings[this.state.currentTraining]}
                updateCallback={(s) => this.onEditUpdate(s)}
            />
        );
    }
}