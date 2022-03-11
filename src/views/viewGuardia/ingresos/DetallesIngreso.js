import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { DialogActions, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetallesIngreso({ingreso}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="ver foto">
        <IconButton
            aria-label="foto del ingreso"
            onClick={handleClickOpen}
            >
            <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Foto del ingreso
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button divider>
            <Grid container spacing={2} style={{justifyContent: 'center'}}>
              <img
                src={ingreso.Imagen}
                width='400'
                height='400'
                alt='fotoIngreso'
              />
            </Grid>
          </ListItem>
        </List>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
}