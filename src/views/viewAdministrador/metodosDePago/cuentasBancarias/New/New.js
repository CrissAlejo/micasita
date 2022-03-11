import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "../../../../../components/CustomButtons/Button";
import useStyles from "./useStyles";
import { Container } from "@material-ui/core";
import Page from "../../../../../components/Page";

import CreateForm from "./CreateForm";
import Header from "./Header";

function New(props) {
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
      <Button color="primary" onClick={handleOpen}>
        Registrar cuenta bancaria
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent= {Backdrop}
        BackdropProps={{ timeout: 500 }}
        disableBackdropClick
       
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Page className={classes.root} title="CrearCuenta">
              <Container maxWidth="lg">
                <Header onClick={() => handleClose()} />
                <CreateForm send={() => handleClose()}  />
              </Container>
            </Page>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default New;
