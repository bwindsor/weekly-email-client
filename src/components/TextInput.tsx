import * as React from "react"

interface TextInputParams {
    text: string | null;
    onChange: (text: string | null) => void;
    isValid: boolean;
    placeholder?: string;
}

let styles = {
    invalid_text: {width: "100%", padding: "2px", border: "2px solid red", borderRadius: "4px"},
    valid_text: {width: "100%", padding: "2px", border: "2px solid green", borderRadius: "4px"},
}

export default class TextInput extends React.Component<TextInputParams, undefined> {

    render() {
        return (
                <input
                    type="text"
                    style={(this.props.isValid)?styles.valid_text:styles.invalid_text}
                    value={(this.props.text==null)?'':this.props.text}
                    onChange={e=>this.props.onChange((e.target.value=='')?null:e.target.value)}
                    placeholder={(this.props.placeholder)?this.props.placeholder:"Enter text"}
                />
        );
    }
}