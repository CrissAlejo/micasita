import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "../../../../components/CustomButtons/Button";
import useStyles from "./useStyles";
import { Container, Grid } from "@material-ui/core";
import Page from "../../../../components/Page";
import { Tooltip, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import ConjuntoCreateForm from "./ConjuntoCreateForm";
import Header from "./Header";

function NewAndEdit(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {props.data ? (
        <Tooltip title="Editar">
          <IconButton aria-label="editar" onClick={() => handleOpen()}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Grid style={{minWidth: '-webkit-fill-available'}}>
          <Button color="primary" onClick={handleOpen}>
            Registrar Áreas comunales
          </Button>
        </Grid>
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
            <Page className={classes.root} title="Areas Comunales">
              <Container maxWidth="lg">
                <Header onClick={() => handleClose()} />
                <ConjuntoCreateForm
                  data={props.data}
                  send={() => handleClose()}
                  fechavalidate={props.fechavalidate}
                />
              </Container>
            </Page>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default NewAndEdit;
