import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import EditIcon from "@material-ui/icons/Edit";
import useStyles from "./useStyles";
import { Container } from "@material-ui/core";
import Page from "../../../../components/Page";
import { Tooltip, IconButton } from "@material-ui/core";

import ProveedorEditForm from "./ProveedorEditForm";
import Header from "./Header";

function Edit(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formulario] = React.useState(props.data);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Editar">
        <IconButton aria-label="editar" onClick={() => handleOpen()}>
          <EditIcon />
        </IconButton>
      </Tooltip>

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
            <Page className={classes.root} title="Editar proveedor">
              <Container maxWidth="lg">
                <Header onClick={() => handleClose()} />
                <ProveedorEditForm
                  formularios={formulario}
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

export default Edit;
