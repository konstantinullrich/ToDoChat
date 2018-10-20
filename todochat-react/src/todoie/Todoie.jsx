import React, {Component} from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default class Todoie extends Component {

  state = {
    emoji: ""
  }

  states = {
    "5": ["\u{1F601}","\u{1F603}","\u{1F604}","\u{1F60D}"],
    "4": ["\u{1F60A}","\u{1F60C}","\u{1F617}"],
    "3": ["\u{1F612}","\u{1F610}","\u{1F611}"],
    "2": ["\u{1F615}","\u{1F61E}","\u{1F622}","\u{1F625}"],
    "1": ["\u{1F62D}","\u{1F631}","\u{1F624}","\u{1F629}"]
  }


  componentWillMount() {
    this.props.KonstiFirebase.getTodoieState().then(tasks => {
      console.log(tasks, tasks.length);
      let state = (5-tasks.length).toString()
      if(state < 1) state = 1
      else if(state > 5) state = 5
      console.log(Math.floor(Math.random()*this.states[state].length));
      this.setState({ emoji: this.states[state][Math.floor(Math.random()*this.states[state].length)] })
    })

  }
  render() {
    return(
      <Card style={{width: "55%"}}>
        <CardContent>
          <span style={{fontSize: "10em", display: "block", textAlign: "center"}}>{this.state.emoji}</span>
        {/* <h1>&#128513;&#128518;&#128515;&#128525;</h1>
        <h1>&#128524;&#128535;&#128522;</h1>
        <h1>&#128530;&#128528;&#128529;</h1>
        <h1>&#128533;&#128542;&#128549;&#128546;</h1>
        <h1>&#128557;&#128561;&#128548;&#128553;</h1> */}
        </CardContent>
      </Card>
    )
  }
}
