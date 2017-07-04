import * as React from "react"
import { Training, TrainingSubset } from "../common/AppState"
import DatePicker from "react-datepicker"
import * as moment from 'moment';

interface EditTrainingParams {
    training: Training;
    updateCallback: (updateState: TrainingSubset) => void;
}

export default class EditTraining extends React.Component<EditTrainingParams, undefined> {

    handleDateChange(e:moment.Moment) { this.props.updateCallback({
        date_start: Math.round(e.toDate().getTime()/1000)
    })
    }

    render() {
        return (
            <form>
                <DatePicker
                    selected={moment.unix(this.props.training.date_start)}
                    onChange={(e)=>this.handleDateChange(e)}
                />
            </form>
        );
    }
}