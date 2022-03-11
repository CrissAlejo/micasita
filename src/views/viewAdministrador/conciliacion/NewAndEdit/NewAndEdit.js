import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "../../../../components/CustomButtons/Button";
import useStyles from "./useStyles";
import { Container } from "@material-ui/core";
import Page from "../../../../components/Page";
import { Tooltip, IconButton, Avatar, Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import ConciliacionCreateForm from "./ConciliacionCreateForm";
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
    <div>
      
        
          {props.data ? (
            <Tooltip title="Editar">
              <IconButton aria-label="editar" onClick={() => handleOpen()}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            
          ) : (
            <Grid container spacing={0} direction="row" justifyContent="space-between" style={{padding: "0 20px"}}>
              <Grid item>
                <Button color="primary" onClick={handleOpen}>
                  Registrar conciliacion
                </Button>
              </Grid>
              <Grid item>
                <Button color="success" onClick={()=>window.open('https://firebasestorage.googleapis.com/v0/b/micasitaapp-d4b5c.appspot.com/o/documentos%2FFormatoConciliaciones.xlsx?alt=media&token=7d1d367a-0fc4-41d0-9403-f76c6a546ad6', '_blank')}>{/* cambiar esto */}
                  <Avatar>
                    <img
                      src="/assets/img/excel.png"
                      alt="imagen descriptiva de carga de archivos excel"
                      width="50px;"
                    />
                  </Avatar>
                  Descargar Formato
                </Button>
              </Grid>
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
            <Page className={classes.root} title="Conciliar">
              <Container maxWidth="lg">
                <Header onClick={() => handleClose()} />
                <ConciliacionCreateForm
                  data={props.data}
                  send={() => handleClose()}
                  categories={props.categories}
                  fechavalidate={props.fechavalidate}
                />
              </Container>
            </Page>
            
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default NewAndEdit;
