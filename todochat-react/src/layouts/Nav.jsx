import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar';

const Nav = ({user}) => {

  return(
    <AppBar color="default" style={{backgroundColor: "#3b5998"}}>
      <Toolbar>
        <Typography variant="h6" style={{flexGrow: 1, color: "white"}}>
          {(user) ? ("Todolist of " + user.displayName) : "Todochat"}
        </Typography>
        { (user) ? <Avatar alt={user.displayName.slice(0,1)} src={user.photoURL} /> : null}
      </Toolbar>
    </AppBar>
  )
}

export default Nav
