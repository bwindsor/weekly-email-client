import * as React from "react"
import AppState, {createDefaultTraining, Training, TrainingSubset, ShortTraining} from "../common/AppState"
import NavPane from './NavPane'
import EditTraining from "./EditTraining"
import fetch from "node-fetch"
import * as url from 'url'

import 'react-datepicker/dist/react-datepicker.css';

let serverName: string = window.location.origin;

export class App extends React.Component<undefined, AppState> {
    constructor(props : any) {
        super(props);
        let defaultTraining = createDefaultTraining()
        this.state = {
            allTrainings: [],
            training: defaultTraining,
            addTraining: {
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
    onNavClick(id: number) : void {
        this.fetchTraining(id);
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
            body: JSON.stringify(newTraining),
            timeout: 5000
        })
        .then(res=>{return (res.status==200) ? res.json() : Promise.reject(res)})
        .then((data:Training)=> {
            return this.fetchAllTrainings().then(()=>{
                this.fetchTraining(data.id)
            })
        })
        .catch(err=>{
            console.log(err)
            this.setState({addTraining: {...this.state.addTraining, isWaiting: false, success: false}})
        })
/*
        this.setState((prevState,props):AppState=>{
            

            let shortTrainings = prevState.allTrainings.slice()
            shortTrainings.push({
                id: newTraining.id,
                date_start: newTraining.date_start,
                location_name: newTraining.location_name,
                start_lat: newTraining.start_lat,
                start_lon: newTraining.start_lon
            });
            return {
                ...prevState,
                allTrainings: shortTrainings,
                training: newTraining
            }
        })
        */
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
                        onItemClick={id=>this.onNavClick(id)}
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