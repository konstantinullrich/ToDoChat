import React, {Component} from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default class AddTask extends Component {

  state = {
    name: "",
    done_till: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let todo = this.state
    todo.id = Math.random() // TODO replace with result of firebase
    this.props.addTodo(todo)
    this.setState({
      name: "",
      done_till: ""
    })
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <TextField id="name" label="Todo" autoComplete="off" required fullWidth
          value={this.state.name}
          onChange={this.handleChange}
        />
        <TextField id="done_till" type="date" required fullWidth
          label="Date"
          value={this.state.done_till}
          onChange={this.handleChange}
          InputLabelProps={{ shrink: true }}
          style={{margin: "4vh 0"}}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>Add Todo</Button>
        {/* <br />
        <Divider absolute={true} /> */}
        {/* <hr /> */}
      </form>
    )
  }
}
