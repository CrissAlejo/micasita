import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";
import * as FirestoreService from "./services/firestore";
import New from "./New/New"
import { Paper } from "@material-ui/core";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from "../../../components/CustomButtons/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, Box, CardHeader } from "@material-ui/core";

import useSettings from "../../../contextapi/hooks/useSettings";


import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import NuevoSubRubro from "./NuevoSubRubro";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: '100%',
    width: '100%'
  },
  pageName: {
    paddingTop: theme.spacing(3),
    font: "var(--unnamed-font-style-normal) normal bold 30px/34px var(--unnamed-font-family-arial)",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "var(--unnamed-color-ffffff)",
    opacity: 1,
  },
  headItem: {
    background: "#051e34",
    color: "#FFFFFF"
  },
  icon: {
    color: "#FFFFFF",
    paddingRight: 1
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  column: {
    flexBasis: '87%',
  },
  columnButton: {
    flexBasis: '2%',
  },
}));

const RubrosEgresos = () => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [rubros, setRubros] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [rubro, setRubro] = React.useState(null);
  const [subRubro, setSubRubro] = React.useState(null);
  const [loading, setLoading] = React.useState(true);



  React.useEffect(() => {
    try {
      FirestoreService.getRubros(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setRubros(Items);
            setLoading(false);
          },
        },
        settings.idConjunto, "Egreso"
      );
    } catch (e) { }
  }, [settings.idConjunto]);


  function handleDelete(rubro,subRubro) {
    setOpen(true);
    setRubro(rubro);
    setSubRubro(subRubro);
  }

  const handleClose = () => {
    setOpen(false);
  };


  const confir = () => {
    setOpen(false);
    setLoading(true);

    if (rubro && subRubro) {     
      var value = rubro.data().SubRubros.filter(item => item !== subRubro)
      FirestoreService.updateRubro(settings.idConjunto, rubro.id, value).then(() => {
          setRubro(null)  
          setSubRubro(null)
          setLoading(false);
        }
      );
    }
    else if(rubro) {
      FirestoreService.deleteRubro(settings.idConjunto,rubro.id).then(()=>{
        setRubro(null)  
        setSubRubro(null)
        setLoading(false);
      })
    }
  };

  return (
    <Paper className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Eliminar
        </DialogTitle>
        <DialogContent>
          ¿Estás seguro que que  quieres eliminar?
          <DialogContentText>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="danger">
            Cancelar
          </Button>
          <Button onClick={confir} color="warning">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <h1>Rubros de Egresos</h1>
      <New />
      {!loading ? (
        <view>
          {rubros ?
            (rubros.map(rubro => {
              return (
                <Accordion defaultExpanded>
                  <Box width={1} className={classes.headItem}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon className={classes.icon} />}
                      aria-controls="expandir o contraer contenido"
                      id="panel1a-header">       
                      <div className={classes.column}>
                      <Typography className={classes.heading}>{rubro.data().Nombre }</Typography>
                      </div>
                      <div className={classes.columnButton}>
                        <NuevoSubRubro rubro = {rubro}/>
                      </div>  
                      <div>
                      <IconButton edge="end" aria-label="delete" size = "small" onClick={() => handleDelete(rubro,null)}>
                          <DeleteIcon className={classes.icon}/>
                       </IconButton>
                      </div>                                          
                    </AccordionSummary>
                  </Box>
                  <AccordionDetails>
                    <Box width={1}>
                      <List >
                        {rubro.data().SubRubros ? (
                          rubro.data().SubRubros.map((subRubro) => {
                            return (
                              <Box width={1} borderBottom={1} borderColor="grey.500">
                                <ListItem>
                                  <ListItemIcon>
                                    <KeyboardArrowRightIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={subRubro}
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(rubro,subRubro)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              </Box>
                            );
                          })
                        ) : (
                          null
                        )
                        }
                      </List>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })) : (
              null
            )
          }
        </view>
      ) : (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
export default RubrosEgresos;
