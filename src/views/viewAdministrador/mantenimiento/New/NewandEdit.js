import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import useStyles from "./useStyles";
import { Container } from "@material-ui/core";
import Page from "../../../../../src/components/Page";
import Header from "./Header";
import EditIcon from "@material-ui/icons/Edit";
import CreateForm from "./CreateForm";
import { Tooltip, IconButton } from "@material-ui/core";
import BuildIcon from '@material-ui/icons/Build';
function NewandEdit(props) {
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {props.data ? (
        <Tooltip title="Editar">
          <IconButton aria-label="editar" onClick={() => handleOpen()}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : (
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        <center>
          <BuildIcon/> 
          <br/>
          Nuevo Mantenimiento
        </center> 
      </Button>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Page className={classes.root} title="Crear Mantenimiento">
              <Container maxWidth="lg">
                <Header title={props.data ? "Editar Mantenimiento" : "Nuevo Mantenimiento"} onClick={() => handleClose()} />
                <CreateForm
                data={props.data}
                send={() => handleClose()} 
               
               />
              </Container>
            </Page>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default NewandEdit;
