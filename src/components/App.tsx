import * as React from "react"
import AppState, {trainingToShortTraining, createDefaultTraining, Training, TrainingSubset, ShortTraining} from "../common/AppState"
import NavPane from './NavPane'
import EditTraining from "./EditTraining"
// import fetch from "node-fetch"
import * as url from 'url'

import 'react-datepicker/dist/react-datepicker.css';

let serverName: string = window.location.origin;

export class App extends React.Component<undefined, AppState> {
    constructor(props : any) {
        super(props);
        this.state = {
            allTrainings: [],
            training: null,
            isModified: false,
            isConfirmingEmail: false,
            sendMail: {
                isWaiting: false,
                success: true,
                doneOnce: false
            },
            addTraining: {
                isWaiting: false,
                success: true
            },
            updateTraining: {
                isWaiting: false,
                success: true
            }
        }
    }

    getSelectedTraining(): number {
        return (this.state.training==null) ? null : this.state.training.id
    }

    onEditUpdate(stateDiff: TrainingSubset) : void {
        this.setState((prevState, props):AppState => {
            let newTraining = {...prevState.training, ...stateDiff}

            let sel = this.getSelectedTraining()
            let selIdx = prevState.allTrainings.findIndex(t=>{return t.id==sel})
            let newAll = prevState.allTrainings.slice()
            newAll[selIdx] = trainingToShortTraining(newTraining)
            return {
                ...prevState,
                isModified: true,
                allTrainings: newAll,
                training: newTraining,
                sendMail: {
                    ...prevState.sendMail,
                    doneOnce: false
                }
            }
        })
    }

    componentDidMount() {
        this.fetchAllTrainings().then(()=>{
            if (this.state.allTrainings.length>0) {
                this.fetchTraining(this.state.allTrainings[0].id)
            }
        }).catch(err=>console.log(err))
    }
    fetchAllTrainings():Promise<void> {
        return fetch(url.resolve(serverName, '/trainings'), {
            method: 'GET',
            credentials: 'include'
        })
            .then(res=>{return res.json()})
            .then((data: ShortTraining[])=>{
                this.setState({allTrainings:data})
            }).catch(err=>console.log(err))
    }

    fetchTraining(id:number) {
        fetch(url.resolve(serverName, '/trainings/'+id.toString()), {
            method: 'GET',
            credentials: 'include'
        }).then(res=>{
            res.json().then((data:Training)=>{
                this.setState({isModified: false, training: data})
            }).catch(err=>console.log(err))
        })
    }
    distribute(toAddress: string): void {
        this.setState({sendMail: {isWaiting: true, success: false}})
        fetch(url.resolve(serverName, '/distribute'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({to: toAddress})
        })
        .then(res=>{
            if (res.status!=200) {throw Error(res.toString())}
            this.setState({sendMail: {isWaiting: false, success: true, doneOnce: true}})
        })
        .catch(err=>{
            console.log(err)
            this.setState({sendMail: {isWaiting: false, success: false, doneOnce: true}})
        })
    }
    removeTraining(id:number) {
        fetch(url.resolve(serverName, '/trainings/'+id.toString()), {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res=>{
            if (res.status!=204) {throw Error(res.toString())}
            return this.fetchAllTrainings()
        })
        .then((res)=>{
            if (this.state.training.id == id) {
                if (this.state.allTrainings.length > 0) {
                    this.fetchTraining(this.state.allTrainings[0].id)
                } else {
                    this.setState({...this.state, training: null})
                }
            }
        })
        .catch(err=>console.log(err))
    }
    addTraining() {
        let newTraining = createDefaultTraining()
        this.setState({addTraining: {...this.state.addTraining, isWaiting: true}})
        fetch(url.resolve(serverName, '/trainings'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newTraining)
        })
        .then(res=>{return (res.status==201) ? res.json() : Promise.reject(res)})
        .then((data:Training)=> {
            this.setState({addTraining: {...this.state.addTraining, isWaiting: false, success: true}})
            return this.fetchAllTrainings().then(()=>{
                this.fetchTraining(data.id)
            })
        })
        .catch(err=>{
            console.log(err)
            this.setState({addTraining: {...this.state.addTraining, isWaiting: false, success: false}})
        })
    }
    updateTraining(training: Training) {
        this.setState({updateTraining: {...this.state.updateTraining, isWaiting: true}})
        fetch(url.resolve(serverName, '/trainings/'+training.id.toString()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(training)
        })
        .then(res=>{
            if (res.status!=200) {throw Error(res.toString())}
            this.setState({isModified: false, updateTraining: {...this.state.updateTraining, isWaiting: false, success: true}})
        })
        .catch(err=>{
            console.log(err)
            this.setState({updateTraining: {...this.state.updateTraining, isWaiting: false, success: false}})
        })
    }
    saveTraining() {
        if (this.isFormValid()) {
            this.updateTraining(this.state.training)
        }
    }
    isFormValid(): boolean {
        if (this.state.training==null) {return false}
        return EditTraining.prototype.validate(this.state.training)
    }

    render() {
        return (
            <div>
                 <div className={'training-list'}>
                    <h1>Training Editor</h1>
                    {(this.state.isModified) ? (
                        <div>
                            <button className={(this.isFormValid())?'save-button':'disabled-save-button'}
                                      onClick={(this.isFormValid())?e=>this.saveTraining():e=>{}}>
                                Save
                            </button>
                            <button className={'cancel-button'} onClick={e=>{
                                    this.setState({isModified: false})
                                    this.fetchTraining(this.getSelectedTraining())
                                }}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button className={'new-button'} onClick={e=>this.addTraining()}>
                                +
                            </button>
                            <NavPane
                                trainings={this.state.allTrainings}
                                selectedTraining={this.getSelectedTraining()}
                                onItemSelect={id=>this.fetchTraining(id)}
                                onItemDelete={id=>this.removeTraining(id)}
                            />
                            <button className={'preview-button'} onClick={e=>window.open(url.resolve(serverName, '/preview'), '_blank')}>
                                Preview
                            </button>
                            <button className={'distribute-button'} onClick={this.state.sendMail.isWaiting?(e=>{}):(e=>this.setState({isConfirmingEmail: true}))}>
                                {this.state.sendMail.isWaiting?'Sending...':(this.state.sendMail.success?'Send':'Retry')}
                            </button>
                            <div>
                                {(!this.state.sendMail.doneOnce || this.state.sendMail.isWaiting)?'':(
                                    this.state.sendMail.success?'Sent successfully':'Send failed'
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className={(this.state.isModified)?'training-detail-mod':'training-detail-unmod'}>
                    {(this.state.training!=null) ? (
                        <EditTraining 
                            training={this.state.training}
                            updateCallback={(s) => this.onEditUpdate(s)}
                        />
                    ) : (
                        <div>
                        {(this.state.allTrainings.length > 0)?'Loading...':'No trainings available'}
                        </div>
                    )}
                </div>
            </div>
        )

    }
}