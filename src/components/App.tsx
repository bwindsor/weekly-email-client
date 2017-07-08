import * as React from "react"
import AppState, {createDefaultTraining, Training, TrainingSubset, ShortTraining} from "../common/AppState"
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

    onEditUpdate(stateDiff: TrainingSubset) : void {
        this.setState((prevState, props):AppState => {
            return {
                ...prevState,
                training: {...prevState.training, ...stateDiff}
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
        return fetch(url.resolve(serverName, '/trainings'))
            .then(res=>{return res.json()})
            .then((data: ShortTraining[])=>{
                if (data.length > 0) {
                    this.setState({allTrainings:data})
                }
            }).catch(err=>console.log(err))
    }

    fetchTraining(id:number) {
        fetch(url.resolve(serverName, '/trainings/'+id.toString())).then(res=>{
            res.json().then((data:Training)=>{
                this.setState({training: data})
            }).catch(err=>console.log(err))
        })
    }
    removeTraining(id:number) {
        fetch(url.resolve(serverName, '/trainings/'+id.toString()), {
            method: 'DELETE'
        })
        .then(res=>{
            if (res.status!=200) {throw Error(res.toString())}
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
            body: JSON.stringify(newTraining)
        })
        .then(res=>{return (res.status==200) ? res.json() : Promise.reject(res)})
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
        fetch(url.resolve(serverName, '/trainings'+training.id.toString()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
        .then(res=>{
            if (res.status!=200) {throw Error(res.toString())}
            this.setState({updateTraining: {...this.state.updateTraining, isWaiting: false, success: true}})
        })
        .catch(err=>{
            console.log(err)
            this.setState({updateTraining: {...this.state.updateTraining, isWaiting: false, success: false}})
        })
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
                        selectedTraining={(this.state.training==null)?null:this.state.training.id}
                        onItemSelect={id=>this.fetchTraining(id)}
                        onItemDelete={id=>this.removeTraining(id)}
                    />
                </div>
                <div className={'training-detail'}>
                    {(this.state.training!=null) ? (
                        <EditTraining 
                            training={this.state.training}
                            updateCallback={(s) => this.onEditUpdate(s)}
                        />
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