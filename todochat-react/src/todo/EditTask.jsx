import React from 'react'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const EditTask = ({open, editName, editDateTill, handleEdit, editTask}) => {

  const handleClose = e => {
    handleEdit({
      editId: "",
      editName: "",
      editDateTill: ""
    })
  }

  const handleChange = e => {
    handleEdit({
      [e.target.id]: e.target.value
    })
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Task</DialogTitle>
      <form onSubmit={editTask}>
        <DialogContent>
            <TextField id="editName" label="Todo" autoComplete="off" required fullWidth
              value={editName}
              onChange={handleChange}
            />
            <TextField id="editDateTill" type="date" autoComplete="off" required fullWidth
              label="Done till"
              value={editDateTill}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              style={{margin: "4vh 0"}}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button variant="contained" color="primary" type="submit">Update Task</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditTask
