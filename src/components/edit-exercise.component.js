import React, {Component} from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

export default class EditExercise extends Component{
    constructor(props){
        super(props)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangeDescription = this.onChangeDescription.bind(this)
        this.onChangeDuration = this.onChangeDuration.bind(this)
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state={
            username:"",
            description:"",
            duration:0,
            date: new Date(),
            users : []
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/exercises/'+this.props.match.params.id)
            .then(response=>{
                this.setState({
                    username: response.data.username,
                    description: response.data.description,
                    duration: response.data.duration,
                    date : new Date(response.data.date)
                })
            })
            .catch(err=>{
                console.log(err)
            })


        axios.get('http://localhost:5000/users/')
           .then(response=>{
               if(response.data.length>0){
                   this.setState({
                       users : response.data.map(user=>user.username),
                       username : response.data[0].username
                   })
               }
           })

    }

    onChangeUsername(e){
        this.setState({
            username:e.target.value
        })
    }

    onChangeDescription(e){
        this.setState({
            description:e.target.value
        })
    }

    onChangeDuration(e){
        this.setState({
            duration:e.target.value
        })
    }

    onChangeDate(date){
        this.setState({
            date:date
        })
    }

    onSubmit(e){
        e.preventDefault();
        const exercise = {
            username: this.state.username,
            duration: this.state.duration,
            description: this.state.description,
            date: this.state.date
        }
        console.log(exercise)
        axios.post('http://localhost:5000/exercises/update/'+this.props.match.params.id, exercise)
           .then(res=>console.log(res))
           .catch(err=>console.log(err))
        window.location='/'
    }
    render(){
        return(
            <div>
                <h3>Update Exercise!</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Usename:</label>
                        <select ref="userInput"
                             required
                             className="form-control"
                             value={this.state.username}
                             onChange={this.onChangeUsername}>
                                 {
                                     this.state.users.map(function(user){
                                         return<option
                                           key={user}
                                           value={user}>
                                               {user}
                                           </option>
                                     })
                                 }
                             </select>
                        </div>
                             <div className="form-group">
                                 <label>Description</label>
                                 <input type="text" required className="form-control" value={this.state.description} onChange={this.onChangeDescription}/>
                             </div>
                             <div className="form-group">
                                 <label>Duration (in minutes)</label>
                                 <input type="text" required className="form-control" value={this.state.duration} onChange={this.onChangeDuration}/>
                             </div>
                             <div className="form-group">
                                 <label>Date: </label>
                                 <div>
                                     <DatePicker selected={this.state.date} onChange={this.onChangeDate}/>
                                 </div>
                             </div>
                             <div className="form-group">
                                 <input type="submit"  className="btn btn-primary" value="Update Exercise Log" />
                             </div>
                </form>
            </div>
        )
    }
}