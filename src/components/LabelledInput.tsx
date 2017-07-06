import * as React from "react"

interface LabelledInputProps {
    label: string
    height?: string
}

let styles = {
    wrapper: {width: "700px", padding: "3px"},
    left: {width: "200px", height: "100%", float:"left", display:'inline-block'},
    right: {width: "500px", height: "100%", display:'inline-block'}
}

export default class LabelledInput extends React.Component<LabelledInputProps, undefined> {

    render() {
        let wrapperStyle = (this.props.height)?{...styles.wrapper, height:this.props.height}:styles.wrapper

        return (
            <div style={wrapperStyle}>
                <div style={styles.left}>
                    {this.props.label}
                </div>
                <div style={styles.right}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}