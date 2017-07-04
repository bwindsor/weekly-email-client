import * as React from "react"
import { Training, TrainingSubset } from "../common/AppState"
import LabelledDatePicker from "./LabelledDatePicker"
import * as moment from 'moment';

interface EditTrainingParams {
    training: Training;
    updateCallback: (updateState: TrainingSubset) => void;
}

export default class EditTraining extends React.Component<EditTrainingParams, undefined> {

    render() {
        return (
            <div>
            <LabelledDatePicker
                label="Start date"
                unix_time={this.props.training.date_start}
                onChange={(unix_time)=>this.props.updateCallback({date_start: unix_time})}
            />
            <LabelledDatePicker
                label="End date"
                unix_time={this.props.training.date_end}
                onChange={(unix_time)=>this.props.updateCallback({date_end: unix_time})}
            />
            </div>
        );
    }
}