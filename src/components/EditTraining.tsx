import * as React from "react"
import { Training, TrainingSubset } from "../common/AppState"
import NullableDatePicker from "./NullableDatePicker"
import TextInput from "./TextInput"
import LabelledInput from "./LabelledInput"
import MapPointSelector from "./MapPointSelector"
import * as moment from 'moment';

interface EditTrainingParams {
    training: Training;
    updateCallback: (updateState: TrainingSubset) => void;
}
interface EditTrainingState {
    cost_adult_text: string;
    cost_junior_text: string;
}

export default class EditTraining extends React.Component<EditTrainingParams, EditTrainingState> {
    constructor(props:EditTrainingParams) {
        super(props);
        this.state = {
            cost_adult_text: (props.training.cost_adult==null)?'':props.training.cost_adult.toString(),
            cost_junior_text: (props.training.cost_junior==null)?'':props.training.cost_junior.toString()
        }
    }

    validateNotNull(text:string) : boolean {
        return text != null
    }
    validateString(text:string) : boolean {
        return true
    }
    validateTime(text:string | null) : boolean {
        if (text==null) {return true}
        return text.match(/^(([01]?[0-9])|(2[0-3])):[0-5][0-9]$/) != null    
}
    validateCost(text:string) : boolean {
        return text.match(/^\d{0,6}(\.\d{0,2})?$/) != null
    }
    onCostChange(text:string | null, appCb: (c: number|null)=>void, uiCb: (s: string)=>void) : void {
        if (text==null) {
            uiCb('')
            appCb(null)
        } else if (this.validateCost(text)) {
            uiCb(text)
            appCb(Number.parseFloat(text))
        }
    }
    onJuniorsChange(e: React.ChangeEvent<HTMLInputElement>): void {
        let j:number

        if (e.currentTarget.value == "yes") {
            j = 1
        } else if (e.currentTarget.value == "no") {
            j = 0
        } else {
            j = null
        }
        this.props.updateCallback({juniors: j})
    }

    render() {
        return (
            <div>
            <LabelledInput label="Start date">
                <NullableDatePicker
                    unix_time={this.props.training.date_start}
                    onChange={(unix_time)=>this.props.updateCallback({date_start: unix_time})}
                    isNullable={false}
                />
            </LabelledInput>
            <LabelledInput label="End date">
                <NullableDatePicker
                    unix_time={this.props.training.date_end}
                    onChange={(unix_time)=>this.props.updateCallback({date_end: unix_time})}
                    isNullable={true}
                />
            </LabelledInput>
            <LabelledInput label="Location Name">
                <TextInput
                    text={this.props.training.location_name}
                    onChange={s=>this.props.updateCallback({location_name: s})}
                    isValid={this.validateNotNull(this.props.training.location_name)}
            />
            </LabelledInput>
            <LabelledInput label="First start time">
                <TextInput
                    text={this.props.training.first_start_time}
                    onChange={s => this.props.updateCallback({first_start_time: s})}
                    placeholder="e.g. 18:00"
                    isValid={this.validateTime(this.props.training.first_start_time)}
                />
            </LabelledInput>
            <LabelledInput label="Last start time">
                <TextInput
                    text={this.props.training.last_start_time}
                    onChange={s => this.props.updateCallback({last_start_time: s})}
                    placeholder="e.g. 18:30"
                    isValid={this.validateTime(this.props.training.last_start_time)}
                />
            </LabelledInput>
            <LabelledInput label="Address">
                <TextInput
                    text={this.props.training.address}
                    onChange={s=>this.props.updateCallback({address: s})}
                    isValid={this.validateString(this.props.training.address)}
                />
            </LabelledInput>
            <LabelledInput label="Description">
                <TextInput
                    text={this.props.training.description}
                    onChange={s=>this.props.updateCallback({description: s})}
                    placeholder="e.g. Attack points"
                    isValid={this.validateString(this.props.training.description)}
                />
            </LabelledInput>
            <LabelledInput label="Parking Further Info">
                <TextInput
                    text={this.props.training.parking_info}
                    onChange={s=>this.props.updateCallback({parking_info: s})}
                    placeholder="e.g. Cost £3. Closes at 10pm."
                    isValid={this.validateString(this.props.training.parking_info)}
                />
            </LabelledInput>
            <LabelledInput label="Organiser name">
                <TextInput
                    text={this.props.training.organiser_name}
                    onChange={s=>this.props.updateCallback({organiser_name: s})}
                    isValid={this.validateString(this.props.training.organiser_name)}
                />
            </LabelledInput>
            <LabelledInput label="Organiser email">
                <TextInput
                    text={this.props.training.organiser_email}
                    onChange={s=>this.props.updateCallback({organiser_email: s})}
                    isValid={this.validateString(this.props.training.organiser_email)}
                />
            </LabelledInput>
            <LabelledInput label="Organiser phone">
                <TextInput
                    text={this.props.training.organiser_phone}
                    onChange={s=>this.props.updateCallback({organiser_phone: s})}
                    isValid={this.validateString(this.props.training.organiser_phone)}
                />
            </LabelledInput>
            <LabelledInput label="Club">
                <TextInput
                    text={this.props.training.club}
                    onChange={s=>this.props.updateCallback({club: s})}
                    placeholder="e.g. CUOC"
                    isValid={this.validateString(this.props.training.club)}
                />
            </LabelledInput>
            <LabelledInput label="Other Information">
                <TextInput
                    text={this.props.training.other_info}
                    onChange={s=>this.props.updateCallback({other_info: s})}
                    placeholder="e.g. Orienteering shoes recommended"
                    isValid={this.validateString(this.props.training.other_info)}
                />
            </LabelledInput>
            <LabelledInput label="Cost (Adult)">
                <TextInput
                    text={this.state.cost_adult_text}
                    onChange={s => this.onCostChange(s, c=>this.props.updateCallback({cost_adult: c}), s=>this.setState({cost_adult_text: s}))}
                    placeholder="e.g. 3"
                    isValid={true}
                />
            </LabelledInput>
            <LabelledInput label="Cost (Junior)">
                <TextInput
                    text={this.state.cost_junior_text}
                    onChange={s => this.onCostChange(s, c=>this.props.updateCallback({cost_junior: c}), s=>this.setState({cost_junior_text: s}))}
                    placeholder="e.g. 1.50"
                    isValid={true}
                />
            </LabelledInput>
            <LabelledInput label="Start Location" height="200px">
                <MapPointSelector
                    lat={this.props.training.start_lat}
                    lon={this.props.training.start_lon}
                    onClick={(lat,lon)=>{this.props.updateCallback({start_lat: lat, start_lon: lon})}}
                />
            </LabelledInput>
            <LabelledInput label="End Location" height="200px">
                <MapPointSelector
                    lat={this.props.training.parking_lat}
                    lon={this.props.training.parking_lon}
                    onClick={(lat,lon)=>{this.props.updateCallback({parking_lat: lat, parking_lon: lon})}}
                />
            </LabelledInput>
            <LabelledInput label="Juniors allowed?">
                <tbody><tr>
                    <td><input type="radio" name="juniors" checked={this.props.training.juniors==1} value="yes"  onChange={e=>this.onJuniorsChange(e)}>Yes</input></td>                    
                    <td><input type="radio" name="juniors" checked={this.props.training.juniors==0} value="no" onChange={e=>this.onJuniorsChange(e)}>No</input></td>
                    <td><input type="radio" name="juniors" checked={this.props.training.juniors==null} value="Not specified"  onChange={e=>this.onJuniorsChange(e)}>Not specified</input></td>
                </tr></tbody>
            </LabelledInput>
            </div>
        );
    }
}