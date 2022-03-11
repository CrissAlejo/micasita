import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import useStyles from "./useStyles";
import { Container } from "@material-ui/core";
import Page from "../../../../../src/components/Page";

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
      <Button color="primary" variant = "outlined" onClick={handleOpen}>
        Nuevo Egreso
      </Button>
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
            <Page className={classes.root} title="Egresos">
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
