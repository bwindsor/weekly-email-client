import * as React from "react"
import {ShortTraining} from '../common/AppState'
let ReactModalDialog = require('react-modal-dialog');
let ModalContainer = ReactModalDialog.ModalContainer
let ModalDialog = ReactModalDialog.ModalDialog

interface NavPaneProps {
    trainings: ShortTraining[];
    selectedTraining: number | null;
    onItemSelect: (id: number) => void;
    onItemDelete: (id: number) => void;
}

interface NavPaneState {
    isConfirmingDelete: boolean
    idBeingDeleteConfirmed: number
}

let styles = {
    wrapper: {width: "700px", padding: "3px"},
    left: {width: "200px", height: "100%", float:"left", display:'inline-block'},
    right: {width: "500px", height: "100%", display:'inline-block'}
}

export default class NavPane extends React.Component<NavPaneProps, NavPaneState> {

    constructor(props: NavPaneProps) {
        super(props)
        this.state = {
            isConfirmingDelete: false,
            idBeingDeleteConfirmed: null
        }
    }

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
            this.setState({isConfirmingDelete: true, idBeingDeleteConfirmed: id})
        } else {
            console.log('Error during delete click callback')
        }
    }
    onDeleteConfirm(){
        if (this.state.idBeingDeleteConfirmed == null) {
            alert('Error deleting')
            return
        }
        this.props.onItemDelete(this.state.idBeingDeleteConfirmed)
        this.setState({isConfirmingDelete: false, idBeingDeleteConfirmed: null})
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
            <div>
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
            {this.state.isConfirmingDelete &&
                <ModalContainer onClose={()=>this.setState({isConfirmingDelete: false})} zIndex={1000}>
                    <ModalDialog onClose={()=>this.setState({isConfirmingDelete: false})}>
                        Really delete this training session?
                        <button className={'distribute-button'} onClick={e=>this.setState({isConfirmingDelete:false})}>No</button>
                        <button className={'distribute-button'} onClick={e=>this.onDeleteConfirm()}>Yes</button>
                    </ModalDialog>
                </ModalContainer>
            }
            </div>
        )
         
    }
}