import * as React from "react"
import {ShortTraining} from '../common/AppState'

interface NavPaneProps {
    trainings: ShortTraining[];
    selectedTraining: number | null;
    onItemSelect: (id: number) => void;
    onItemDelete: (id: number) => void;
}

let styles = {
    wrapper: {width: "700px", padding: "3px"},
    left: {width: "200px", height: "100%", float:"left", display:'inline-block'},
    right: {width: "500px", height: "100%", display:'inline-block'}
}

export default class NavPane extends React.Component<NavPaneProps, undefined> {

    onClick(e: React.MouseEvent<HTMLTableRowElement>) : void {
        let id = this.parseId(e.currentTarget.id)
        if (id!=null) {
            this.props.onItemSelect(id);
        } else {
            console.log('Error during click callback')
        }
    }
    onDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        let id = this.parseId(e.currentTarget.id)
        if (id!=null) {
            this.props.onItemDelete(id)
        } else {
            console.log('Error during delete click callback')
        }
    }
    parseId(id: string):(number | null) {
        let match = id.match(/\d+/)
        if (match==null) {return null}
        
        let num = Number.parseInt(match[0])
        if (Number.isNaN(num)) {return null}
        
        return num;
    }

    render() {
        return (
            <table className="nav-table">
                <tbody>
                {this.props.trainings.map((t, i) => {
                    let d = new Date(t.date_start*1000)
                    return (
                        <tr className={(this.props.selectedTraining!=null && this.props.selectedTraining==t.id)?'navRow-selected':'navRow'}
                        id={'nav'+t.id.toString()}
                        key={t.id.toString()}
                        onClick={e=>this.onClick(e)}>
                        <td>{d.getDate()}/{d.getMonth()+1}</td><td>{t.location_name}</td>
                        <td>
                            <button className={'remove-button'}
                                id={'delete'+t.id.toString()}
                                onClick={e=>this.onDeleteClick(e)}>
                                X
                            </button>
                        </td>
                    </tr>
                )})}
            </tbody>
            </table>
        )
         
    }
}