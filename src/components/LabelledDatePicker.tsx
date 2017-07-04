import * as React from "react"
import DatePicker from "react-datepicker"
import * as moment from 'moment';

interface LabelledDatePickerParams {
    label: string
    unix_time: number | null;
    onChange: (unix_time: number) => void;
}

let styles = {
    wrapper: {width: "500px"},
    left: {width: "200px", float:"left", display:'inline-block'},
    mid: {width: "200px", float: "left", display:'inline-block'},
    right: {display:'inline-block'}
}

export default class LabelledDatePicker extends React.Component<LabelledDatePickerParams, undefined> {

    handleDateChange(e:moment.Moment) { this.props.onChange(
        Math.round(e.toDate().getTime()/1000)
    )
    }

    render() {
        return (
            <div style={styles.wrapper}>
                <div style={styles.left}>
                    {this.props.label}
                </div>
                <div style={styles.mid}>
                    
                    {this.props.unix_time!=null ? (
                        <DatePicker
                            selected={moment.unix(this.props.unix_time)}
                            onChange={(e)=>this.handleDateChange(e)}
                        />
                    ) : (
                        <button onClick={(e)=>{this.props.onChange(Math.round(new Date().getTime()/1000))}}>
                            Select
                        </button>
                    )
                    }
                </div>
                <div style={styles.right}>
                    {this.props.unix_time!=null &&
                        <button onClick={e=>this.props.onChange(null)}>
                            Clear
                        </button>
                    }
                </div>
            </div>
        );
    }
}