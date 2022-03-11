import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ObsIcon from '@material-ui/icons/PlaylistAddCheck';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  imageList: {
    width: 495,
    height: 400,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: "translateZ(0)"
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function Dialogs({ ced, face, car, obs }) {
  const [viewImg, setViewImg] = useState(false);
  const [itemData, setItemData] = useState([]);
  useEffect(() => {
    if(ced || face || car){
      setItemData([
        {
          img: ced,
          title: "Foto de la Cédula",
          author: "author"
        },
        {
          img: face,
          title: "Foto de Invitado",
          author: "author"
        },
        {
          img: car,
          title: "Foto del Auto",
          author: "author"
        }
      ]);
      setViewImg(true);
    } else {
      setViewImg(false);
    }
  }, []);
  
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
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {viewImg ? <VisibilityIcon />: <ObsIcon/>}
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {viewImg ? (
          <React.Fragment>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Imágenes de la Visita
            </DialogTitle>
            <DialogContent dividers>
              <ImageList rowHeight={200} gap={1} className={classes.imageList}>
                {itemData.map((item) => (
                  <ImageListItem key={item.img} cols={2} rows={2}>
                    <img src={item.img} alt={item.title} />
                    <ImageListItemBar
                      title={item.title}
                      position="top"
                      actionPosition="left"
                      className={classes.titleBar}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </DialogContent>
          </React.Fragment>
        ):(
            <React.Fragment>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Detalle de la Observación
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  {obs ? (obs):("No se registraron observaciones")}
                </Typography>
              </DialogContent>
            </React.Fragment>
        )}
      </Dialog>
    </div>
  );
}