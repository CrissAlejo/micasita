import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
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
import MapIcon from '@material-ui/icons/Map';
import moment from 'moment';
import 'moment/locale/es-mx'
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

export default function DetallesRonda({ronda}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function urlRoute(coord) {
    const coordenadas = coord.map( r => r.coordinates.join()).join('/')
    let url = 'https://www.google.com/maps/dir/'+coordenadas+`/@${coord[0]?.coordinates.join()}`+',19z/data=!3m1!4b1!4m2!4m1!3e2'
    return url
  }

  return (
    <div>
      <Tooltip title="Ver Ronda">
        <IconButton
            aria-label="ver ronda"
            onClick={handleClickOpen}
            >
             
            <MapIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'sm'} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Detalle de la Ronda
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button divider>
            <Grid container spacing={3} style={{justifyContent: 'center'}}>
              {ronda.Ruta.map((punto, ind) => (
                <Grid item md key={ind}>
                  <ListItemText style={{textAlign: 'center'}} primary={punto.name} secondary={moment(punto.fecha.seconds*1000).format('hh:mm A')} />
                </Grid>
              ))}
            </Grid>
          </ListItem>
        </List>
        <DialogActions>
          <Button
            variant='outlined'
            color="primary"
            autoFocus
            onClick={()=>window.open(urlRoute(ronda.Ruta),'_blank')}
          >
            Ver ruta en mapa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}