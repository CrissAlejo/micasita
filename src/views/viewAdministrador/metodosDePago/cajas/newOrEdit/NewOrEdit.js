import React, { useState } from 'react';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import EditIcon from "@material-ui/icons/Edit";
import useStyles from "./useStyles";
import { Container, Tooltip } from "@material-ui/core";
import Button from "../../../../../components/CustomButtons/Button";
import Page from "../../../../../components/Page";
import { IconButton } from "@material-ui/core";

import FormCaja from "./FormCaja";
import Header from "./Header";

const NewOrEdit = ({ cajaData }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [text] = useState(cajaData ? 'Editar Caja':'Crear Caja')
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {!cajaData ? (
                <Button color="danger" onClick={handleOpen}>
                    Registrar Caja
                </Button>
            ):(
                <Tooltip title="Editar">
                    <IconButton aria-label="editar" onClick={() => handleOpen()}>
                        <EditIcon />
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
                        <Page className={classes.root} title="Editar cuenta">
                            <Container maxWidth="lg">
                                <Header onClick={() => handleClose()} title={text} />
                                <FormCaja formulario={cajaData} send={() => handleClose()} />
                            </Container>
                        </Page>
                    </div>
                </Fade>
            </Modal>

        </>
    );
}

export default NewOrEdit
