import * as React from "react"
import {ShortTraining} from '../common/AppState'

interface NavPaneProps {
    trainings: ShortTraining[];
    selectedTraining: number | null;
    onItemClick: (id: number) => void;
}

let styles = {
    wrapper: {width: "700px", padding: "3px"},
    left: {width: "200px", height: "100%", float:"left", display:'inline-block'},
    right: {width: "500px", height: "100%", display:'inline-block'}
}

export default class NavPane extends React.Component<NavPaneProps, undefined> {

    onClick(e: React.MouseEvent<HTMLTableRowElement>) : void {
        let m = e.currentTarget.id.match(/\d+/)
        if (m!=null && !Number.isNaN(Number.parseInt(m[0]))) {
            this.props.onItemClick(Number.parseInt(m[0]));
        } else {
            console.log('Error during click callback')
        }
    }

    render() {
        return (
            <table className="nav-table">
                {this.props.trainings.map((t, i) => {
                    let d = new Date(t.date_start*1000)
                    return (
                    <tr className={(this.props.selectedTraining!=null && this.props.selectedTraining==t.id)?'navRow-selected':'navRow'}
                        id={'nav'+t.id.toString()}
                        key={t.id.toString()}
                        onClick={e=>this.onClick(e)}>
                        <td>{d.getDate()}/{d.getMonth()+1}</td><td>{t.location_name}</td>
                    </tr>
                )})}
            </table>
        )
         
    }
}