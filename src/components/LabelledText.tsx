import * as React from "react"

interface LabelledTextParams {
    label: string
    text: string | null;
    onChange: (text: string | null) => void;
    isValid: boolean;
    placeholder?: string;
}

let styles = {
    wrapper: {width: "500px", padding: "3px"},
    left: {width: "200px", float:"left", display:'inline-block'},
    right: {display:'inline-block'},
    invalid_text: {padding: "2px", border: "2px solid red", borderRadius: "4px"},
    valid_text: {padding: "2px", border: "2px solid green", borderRadius: "4px"},
}

export default class LabelledText extends React.Component<LabelledTextParams, undefined> {

    render() {
        return (
            <div style={styles.wrapper}>
                <div style={styles.left}>
                    {this.props.label}
                </div>
                <div style={styles.right}>
                    <input
                        type="text"
                        style={(this.props.isValid)?styles.valid_text:styles.invalid_text}
                        value={(this.props.text==null)?'':this.props.text}
                        onChange={e=>this.props.onChange((e.target.value=='')?null:e.target.value)}
                        placeholder={(this.props.placeholder)?this.props.placeholder:this.props.label}
                    />
                </div>
            </div>
        );
    }
}