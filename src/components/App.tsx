import * as React from "react"
import AppState, {CreateDefaultTraining, Training, TrainingSubset, ShortTraining} from "../common/AppState"
import EditTraining from "./EditTraining"
import fetch from "node-fetch"
import * as url from 'url'

import 'react-datepicker/dist/react-datepicker.css';

let serverName: string = window.location.origin;

export class App extends React.Component<undefined, AppState> {
    constructor(props : any) {
        super(props);
        let defaultTraining = CreateDefaultTraining()
        this.state = {
            allTrainings: [],
            training: defaultTraining
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
        fetch(url.resolve(serverName, '/trainings')).then(res=>{
            res.json().then((data: ShortTraining[])=>{
                if (data.length > 0) {
                    this.setState({allTrainings:data})
                    this.fetchTraining(data[0].id)
                }
            }).catch(err=>console.log(err))
        })
    }
    fetchTraining(id:number) {
        fetch(url.resolve(serverName, '/trainings/'+id.toString())).then(res=>{
            res.json().then((data:Training)=>{
                this.setState({training: data})
            }).catch(err=>console.log(err))
        })
    }

    render() {
        return (
            <div>
                
                 <div className={'training-list'}>
                    <h1>Trainings</h1>
                    <table>
                    {this.state.allTrainings.map(t => {
                        let d = new Date(t.date_start*1000)
                        return (
                        <tr>
                            <td>{d.getDate()}/{d.getMonth()}</td><td>{t.location_name}</td>
                        </tr>
                    )})}
                    </table>
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