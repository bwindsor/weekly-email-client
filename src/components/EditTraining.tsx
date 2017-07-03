import * as React from "react"
import { Training } from "../common/AppState"
import DatePicker from "react-datepicker"
import * as moment from 'moment';

interface EditTrainingParams {
    training: Training;
}

export default class EditTraining extends React.Component<EditTrainingParams, Training> {
    constructor(props : any) {
        super(props);
        this.state = this.props.training;
    }

    handleDateChange(e:moment.Moment) { console.log(e.toDate())}

    render() {
        return (
            <form>
                <DatePicker
                    selected={moment()}
                    onChange={this.handleDateChange}
                />
            </form>
        );
    }
}