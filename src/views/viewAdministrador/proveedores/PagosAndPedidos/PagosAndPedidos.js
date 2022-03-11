import React from "react";
import { Modal, Container } from "@material-ui/core";
import Header from "./Header";
import Pedidos from "./Pedidos";
import Page from "../../../../components/Page";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import useStyles from "./useStyles";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import { Tooltip, IconButton } from "@material-ui/core";
import EditIcons from "@material-ui/icons/Edit";

const PagosAndPedidos = (props) => {
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
    {props.data.data().ProveedorNombre === "noproveedor" ? (
      <Tooltip title="Editar pedido">
        <IconButton aria-label="editar" onClick={() => handleOpen()}>
          <EditIcons />
        </IconButton>
      </Tooltip>
    ) : props.new ? (
      <Tooltip title="Generar pedido">
        <IconButton aria-label="editar" onClick={() => handleOpen()}>
          <MonetizationOn />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Editar">
        <IconButton aria-label="editar" onClick={() => handleOpen()}>
          <EditIcons />
        </IconButton>
      </Tooltip>
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
            <Page className={classes.root} title="Proveedor">
              <Container maxWidth="lg">
                <Header onClick={() => handleClose()} New={props.new} />
                <Pedidos data={props.data} send={() => handleClose()}  New={props.new}/>
              </Container>
            </Page>
          </div>
        </Fade>
      </Modal>
    </>
  );
};
export default PagosAndPedidos;
