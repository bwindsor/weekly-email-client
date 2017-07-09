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
            testSent: false,
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
                training: newTraining
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
                if (data.length > 0) {
                    this.setState({allTrainings:data})
                }
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
    distributeFinal(): void {
        fetch(url.resolve(serverName, '/distribute?test=0'), {
            method: 'POST',
            credentials: 'include'
        })
        .then(res=>{
            if (res.status!=200) {throw Error(res.toString())}
            this.setState({testSent: false})
            alert("Distribution successful.")
        })
        .catch(err=>{
            console.log(err)
            alert("Distribution failed.")
        })
    }
    distributeTest(): void {
        fetch(url.resolve(serverName, '/distribute'), {
            method: 'POST',
            credentials: 'include'
        })
        .then(res=>{
            if (res.status!=200) {throw Error(res.toString())}
            this.setState({testSent: true})
            alert("Test distribution successful.")
        })
        .catch(err=>{
            console.log(err)
            alert("Test distribution failed.")
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
        .then(()=>{
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
                    <button className={'new-button'} onClick={e=>this.addTraining()}>
                        +
                    </button>
                    <NavPane
                        trainings={this.state.allTrainings}
                        selectedTraining={this.getSelectedTraining()}
                        onItemSelect={id=>this.fetchTraining(id)}
                        onItemDelete={id=>this.removeTraining(id)}
                    />
                </div>
                <div className={(this.state.isModified)?'training-detail-mod':'training-detail-unmod'}>
                    {(this.state.training!=null) ? (
                        <div>
                        <button className={(this.isFormValid())?'save-button':'disabled-save-button'} onClick={e=>this.saveTraining()}>
                            Save
                        </button>
                        <button className={'preview-button'} onClick={e=>window.open(url.resolve(serverName, '/preview'), '_blank')}>
                            Preview
                        </button>
                        <button className={'distribute-button'} onClick={e=>this.distributeTest()}>
                            Send test
                        </button>
                        {this.state.testSent && (
                            <button className={'distribute-button'} onClick={e=>this.distributeFinal()}>
                                Send
                            </button>
                        )}
                        <EditTraining 
                            training={this.state.training}
                            updateCallback={(s) => this.onEditUpdate(s)}
                        />
                        </div>
                    ) : (
                        <div>
                        Loading...
                        </div>
                    )}
                </div>
            </div>
        )
    }
}