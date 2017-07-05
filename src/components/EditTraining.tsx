import * as React from "react"
import { Training, TrainingSubset } from "../common/AppState"
import LabelledDatePicker from "./LabelledDatePicker"
import LabelledText from "./LabelledText"
import * as moment from 'moment';

interface EditTrainingParams {
    training: Training;
    updateCallback: (updateState: TrainingSubset) => void;
}

export default class EditTraining extends React.Component<EditTrainingParams, undefined> {

    validateNotNull(text:string) : boolean {
        return text != null
    }
    validateString(text:string) : boolean {
        return true
    }

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
            <LabelledText
                label="Location Name"
                text={this.props.training.location_name}
                onChange={s=>this.props.updateCallback({location_name: s})}
                isValid={this.validateNotNull(this.props.training.location_name)}
            />
            <LabelledText
                label="Address"
                text={this.props.training.address}
                onChange={s=>this.props.updateCallback({address: s})}
                isValid={this.validateString(this.props.training.address)}
            />
            <LabelledText
                label="Description"
                text={this.props.training.description}
                onChange={s=>this.props.updateCallback({description: s})}
                placeholder="e.g. Attack points"
                isValid={this.validateString(this.props.training.description)}
            />
            <LabelledText
                label="Parking Further Info"
                text={this.props.training.parking_info}
                onChange={s=>this.props.updateCallback({parking_info: s})}
                placeholder="e.g. Cost £3. Closes at 10pm."
                isValid={this.validateString(this.props.training.parking_info)}
            />
            <LabelledText
                label="Organiser name"
                text={this.props.training.organiser_name}
                onChange={s=>this.props.updateCallback({organiser_name: s})}
                isValid={this.validateString(this.props.training.organiser_name)}
            />
            <LabelledText
                label="Organiser email"
                text={this.props.training.organiser_email}
                onChange={s=>this.props.updateCallback({organiser_email: s})}
                isValid={this.validateString(this.props.training.organiser_email)}
            />
            <LabelledText
                label="Organiser phone"
                text={this.props.training.organiser_phone}
                onChange={s=>this.props.updateCallback({organiser_phone: s})}
                isValid={this.validateString(this.props.training.organiser_phone)}
            />
            <LabelledText
                label="Club"
                text={this.props.training.club}
                onChange={s=>this.props.updateCallback({club: s})}
                placeholder="e.g. CUOC"
                isValid={this.validateString(this.props.training.club)}
            />
            <LabelledText
                label="Other information"
                text={this.props.training.other_info}
                onChange={s=>this.props.updateCallback({other_info: s})}
                placeholder="e.g. Orienteering shoes recommended"
                isValid={this.validateString(this.props.training.other_info)}
            />
            </div>
        );
    }
}