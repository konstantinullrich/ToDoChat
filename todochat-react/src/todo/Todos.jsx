import React, {Component} from 'react'

import AddTask from './AddTask'
import EditTask from './EditTask'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

export default class Todos extends Component {

  state = {
    tasks: [],
    editId: "",
    editName: "",
    editDateTill: ""
  }

  componentWillMount() {
    this.props.KonstiFirebase.getTasks().then(tasks => {
      this.setState({tasks})
    })
  }

  addTodo = todo => {
    let todos = this.state.tasks
    this.props.KonstiFirebase.createTask(todo).then(data => {
      todos.push(data)
      this.setState({
        todos: todos
      })
    })
  }

  editTask = e => {
    e.preventDefault()
    let tasks = this.state.tasks
    let task = tasks.filter(t => {
      if(this.state.editId === t.id) return t
    })[0]

    task.name = this.state.editName;
    task.done_till = this.state.editDateTill;

    this.props.KonstiFirebase.updateTask(task).then(data => {
      tasks = tasks.map(t => {
        if(t.id === tasks.id) t = tasks
        return t
      })
      this.setState({
        tasks
      })
    })
    this.setState({
      editId: "",
      editName: "",
      editDateTill: ""
    })
  }

  handleEdit = state => {
    this.setState(state)
  }

  handleChecked = (index) => {
    let todos = this.state.tasks
    let todo = todos[index]
    todo.status = !todo.status
    this.props.KonstiFirebase.updateTask(todo).then(data => {
      todos[index] = todo
      this.setState({
        todos
      })
    })
  }

  render() {
    return(
      <Card style={{width: "35%"}}>
        <CardContent>
        <AddTask addTodo={this.addTodo} />
        <List>
          {this.state.tasks.map((todo, index) => {
            return(
              <ListItem key={todo.id} dense button>
                <ListItemText>{todo.name} :: {todo.done_till}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={() => this.setState({editId: todo.id, editName: todo.name, editDateTill: todo.done_till})}>
                    <EditIcon />
                  </IconButton>
                  <Checkbox id={todo.id} checked={todo.status} onChange={() => this.handleChecked(index)} />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
        </CardContent>
        <EditTask
          open={this.state.editId !== ""}
          editName={this.state.editName}
          editDateTill={this.state.editDateTill}
          handleEdit={this.handleEdit}
          editTask={this.editTask}
        />
      </Card>
    )
  }
}
