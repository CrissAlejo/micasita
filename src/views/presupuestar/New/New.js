import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import useSettings from "../../../contextapi/hooks/useSettings";
import useStyles from "../useStyles";
import TextField from '@material-ui/core/TextField';
import Button from "../../../components/CustomButtons/Button";
import * as XLSX from "xlsx";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
} from "@material-ui/core";
import * as FirestoreService from "../services/firestore";
import { Tooltip, IconButton, Avatar } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useSnackbar } from 'notistack';
import { Formik } from "formik";
import * as Yup from 'yup';
import Row from './Row';

function Presupuestar(props) {
    const classes = useStyles();
    const { settings } = useSettings();
    const history = useHistory();
    const [page] = useState(0);
    const [rowsPerPage] = useState(10);
    const { enqueueSnackbar } = useSnackbar();
    const getYear = () => { return new Date().getFullYear(); }
    const [validator, setValidator] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [formulario2, setFormulario2] = useState("-");
    const [elem, setElem] = useState(null);
    const [dataFromFile, setDataFromFile] = useState([]);
    const [namePresupuestos, setNamePresupuestos] = useState([])
    const [rubIng, setRubIng] = useState([]);
    const [rubEgr, setRubEgr] = useState([]);
    const [presIng, setPresIng] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [presEgr, setPresEgr] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
   
    function cargarDatos(){
        setDataFromFile([]);
        document.getElementById('file').click();
      }
      
    const columnsR = [
        { id: "name", label: "Rubro" },
        { id: "ene", label: "Enero" },
        { id: "feb", label: "Febrero" },
        { id: "mar", label: "Marzo" },
        { id: "abr", label: "Abril" },
        { id: "may", label: "Mayo" },
        { id: "jun", label: "Junio" },
        { id: "jul", label: "Julio" },
        { id: "ago", label: "Agosto" },
        { id: "sep", label: "Septiembre" },
        { id: "oct", label: "Octubre" },
        { id: "nov", label: "Noviembre" },
        { id: "dic", label: "Diciembre" },
        { id: "porAnio", label: "Por Año" },
    ];
    const onCloseModal = () => {
        setOpenModal(!openModal);
    }
    const loadIng = (event) => {
        FirestoreService.getPresupuestoAnterior(settings.idConjunto).then((querySnapshot) => {
            const updatedGroceryItems0 = querySnapshot.docs.map(
                doc => ({
                    id: doc.id,
                    Nombre: doc.data().Nombre,
                    Anio: doc.data().Anio,
                    Fecha: doc.data().Fecha.toDate().toDateString(),
                    Datos: JSON.parse(doc.data().Datos),
                })
            );
            if (updatedGroceryItems0.length > 0) {
                var datos = updatedGroceryItems0[0].Datos;
                event.forEach(element => {
                    datos.ing.forEach(el => {
                        if (element.Nombre === el.Nombre) {
                            let suma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            element.SubRubros.forEach(x => {
                                let valid = false;
                                el.SubRubros.forEach(e => {
                                    if (x.Nombre === e.Nombre) {
                                        x.Valor = e.Valor;
                                        valid = true;
                                    }
                                });
                                if (valid) {
                                    let suma2 = 0;
                                    for (let i = 0; i < 12; i++) {
                                        suma[i] += x.Valor[i] * 1;
                                        suma2 += x.Valor[i] * 1;
                                    }
                                    x.Valor[12] = suma2;
                                }
                            });
                            let acum = 0;
                            suma.forEach(element => {
                                acum += element * 1;
                            });
                            suma[12] = acum;
                            element.Valor = suma;
                        }
                    });
                });
                setPresIng([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                setRubIng(event);
            } else {
                setPresIng([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                setRubIng(event);
            }
        });
    };
    const loadEgr = (event) => {
        FirestoreService.getPresupuestoAnterior(settings.idConjunto).then((querySnapshot) => {
            const updatedGroceryItems0 = querySnapshot.docs.map(
                doc => ({
                    id: doc.id,
                    Nombre: doc.data().Nombre,
                    Anio: doc.data().Anio,
                    Fecha: doc.data().Fecha.toDate().toDateString(),
                    Datos: JSON.parse(doc.data().Datos),
                })
            );
            if (updatedGroceryItems0.length > 0) {
                var datos = updatedGroceryItems0[0].Datos;
                event.forEach(element => {
                    datos.egr.forEach(el => {
                        if (element.Nombre === el.Nombre) {
                            let suma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            element.SubRubros.forEach(x => {
                                let valid = false;
                                el.SubRubros.forEach(e => {
                                    if (x.Nombre === e.Nombre) {
                                        x.Valor = e.Valor;
                                        valid = true;
                                    }
                                });
                                if (valid) {
                                    let suma2 = 0;
                                    for (let i = 0; i < 12; i++) {
                                        suma[i] += x.Valor[i] * 1;
                                        suma2 += x.Valor[i] * 1;
                                    }
                                    x.Valor[12] = suma2;
                                }
                            });
                            let acum = 0;
                            suma.forEach(element => {
                                acum += element * 1;
                            });
                            suma[12] = acum;
                            element.Valor = suma;
                        }
                    });
                });
                setPresEgr([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                setRubEgr(event);
            } else {
                setPresEgr([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                setRubEgr(event);
            }
        });

    };
    const StyledTableCellcian = withStyles((theme) => ({
        head: {
            backgroundColor: "rgba(75, 192, 192, 1)",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    const StyledTableCellWhite = withStyles((theme) => ({
        head: {
            backgroundColor: "rgba(225, 225, 225, 1)",
            color: "#051e34",
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    const StyledTableCellrosa = withStyles((theme) => ({
        head: {
            backgroundColor: "rgba(255, 99, 132, 1)",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const getAll = React.useCallback(() => {
        try {
            FirestoreService.getRubIng(settings.idConjunto).then((querySnapshot) => {
                const updatedGroceryItems2 = querySnapshot.docs.map(
                    doc => ({
                        id: doc.id,
                        Nombre: doc.data().Nombre,
                        Tipo: doc.data().Tipo,
                        SubRubros: doc.data().SubRubros.map(subRubro => ({ Nombre: subRubro, Valor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })),
                        Valor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    })
                );
                //loadIng(updatedGroceryItems2);
                setRubIng(updatedGroceryItems2);
            });
            FirestoreService.getRubEgr(settings.idConjunto).then((querySnapshot) => {
                const updatedGroceryItems3 = querySnapshot.docs.map(
                    doc => ({
                        id: doc.id,
                        Nombre: doc.data().Nombre,
                        Tipo: doc.data().Tipo,
                        SubRubros: doc.data().SubRubros.map(subRubro => ({ Nombre: subRubro, Valor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })),
                        Valor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    })
                );
                //loadEgr(updatedGroceryItems3);
                setRubEgr(updatedGroceryItems3);
            });
            FirestoreService.getPresupuestoByConjunto(settings.idConjunto).then(
                (querySnapshot) => {
                  const Items = querySnapshot.docs.map((doc) => ({
                    Nombre: doc.data().Nombre,
                  }));
                  setNamePresupuestos(Items);
            });
        } catch (e) { }
    }, [settings.idConjunto]);

    React.useEffect(() => {
        getAll();
    }, [getAll]);


    function handleChangeYear(e) {
        const { value } = e.currentTarget;
        if (formulario2 === "-") {
            setFormulario2(value);
            setValidator(true);
            return;
        }
        if (value !== formulario2) {
            setOpen(true);
            setElem(value);
        }
    }
    function resetConfirmed() {
        if (elem) {
            setFormulario2(elem);
            limpiar();
            getAll();
            setOpen(false);
        }
    }

    function handleChangeEgr(e) {
        const { name, value } = e.currentTarget;
        var index = name.split("_")[3];
        var egr = rubEgr;
        egr[index].SubRubros[name.split("_")[1]].Valor[name.split("_")[2]] = value * 1;
        var suma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        egr[index].SubRubros.forEach(element => {
            let suma2 = 0;
            for (let i = 0; i < 12; i++) {
                suma[i] += element.Valor[i] * 1;
                suma2 += element.Valor[i] * 1;
            }
            element.Valor[12] = suma2;
        });
        var acum = 0;
        suma.forEach(element => {
            acum += element * 1;
        });
        suma[12] = acum;
        egr[index].Valor = suma;
        setRubEgr(egr);
    }
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
          fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: "buffer" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            resolve(data);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
        promise.then((d) => {
            let ind=0
            d.every((row, i)=>{
                ind=i
                return row.Ingresos !== 'Egresos'
            })
            const ingresos=d.slice(1,ind)
            const egresos=d.slice(ind+2)
            let newing = []
            let newegr = []
            ingresos.forEach((ing) => {
                let size= Object.keys(ing).length
                if(size > 1){
                    let data = newing.pop();
                    data.SubRubros.push({Nombre: ing.Ingresos, Valor: Object.values(ing).slice(1)});
                    newing.push(data);
                } else {
                    newing.push({
                        Nombre: ing.Ingresos,
                        Tipo: 'Ingreso',
                        SubRubros: [],
                        Valor: new Array(13).fill(0),
                    })
                }
            })
            egresos.forEach((egr) => {
                let size= Object.keys(egr).length
                if(size > 1){
                    let data = newegr.pop();
                    data.SubRubros.push({Nombre: egr.Ingresos, Valor: Object.values(egr).slice(1)});
                    newegr.push(data);
                } else {
                    newegr.push({
                        Nombre: egr.Ingresos,
                        Tipo: 'Egreso',
                        SubRubros: [],
                        Valor: new Array(13).fill(0),
                    })
                }
            })
            setRubIng(newing)
            setRubEgr(newegr)
            setDataFromFile(d);
        });

      };
    function handleChangeIng(e) {
        const { name, value } = e.currentTarget;
        var index = name.split("_")[3];
        var ing = rubIng;
        ing[index].SubRubros[name.split("_")[1]].Valor[name.split("_")[2]] = value * 1;
        var suma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        ing[index].SubRubros.forEach(element => {
            let suma2 = 0;
            for (let i = 0; i < 12; i++) {
                suma[i] += element.Valor[i] * 1;
                suma2 += element.Valor[i] * 1;
            }
            element.Valor[12] = suma2;
        });
        var acum = 0;
        suma.forEach(element => {
            acum += element * 1;
        });
        suma[12] = acum;
        ing[index].Valor = suma;
        setRubIng(ing);
    }

    function presupuestarRubros() {
        var contIng = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var contEgr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        rubIng.forEach(element => {
            for (let i = 0; i < 13; i++) {
                contIng[i] += element.Valor[i] * 1;
            }
        });
        rubEgr.forEach(element => {
            for (let j = 0; j < 13; j++) {
                contEgr[j] += element.Valor[j] * 1;
            }
        });
        setPresIng(contIng);
        setPresEgr(contEgr);
        setValidator(true);
    }

    function verificarNombre(name){
        if(namePresupuestos.length>0){
            let ename = namePresupuestos.filter(presu => presu.Nombre.toLowerCase()===name.toLowerCase());
            return ename.length > 0 ? true : false;
        }return false;
    }

    function limpiar() {
        setValidator(false);
    }

    return (
        <Fragment>
            <div className={classes.contain}>
                <div className={classes.sobre2}>
                    <p className={classes.titulo}>Presupuestar rubros</p>
                    <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                            Cambiar Año del Presupuesto
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Si cambia el año se eliminará su avance<br />¿Desea realizar el cambio?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={() => setOpen(false)} color="danger">
                                Cancelar
                            </Button>
                            <Button onClick={resetConfirmed} color="warning">
                                Confirmar
                            </Button>
                        </DialogActions>
                    </Dialog>
               
                  
                    <TextField
                        style={{paddingRight: "20px"}}
                        id="anio2"
                        label="Año"
                        type="number"
                        name="anio2"
                        select
                        SelectProps={{ native: true }}
                        InputProps={{ inputProps: { value: formulario2, onChange: (event) => handleChangeYear(event) } }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        helperText={"Selecciona el Año"}
                    >
                        <option key={null} value={""}>
                        </option>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <option key={i} value={getYear() + i}>
                                {getYear() + i}
                            </option>
                        ))}
                    </TextField>
                    <Button onClick={presupuestarRubros} className={classes.Button} color="primary">
                        Calcular
                    </Button>

						
               
                    { validator && (
                        <Button onClick={limpiar} className={classes.Button} color="success">
                            Editar
                        </Button>
                    )}
                </div>
                {validator && (
                    <div className={classes.sobre2}>
                        <p className={classes.titulo}>Guardar Presupuesto</p>

                        <Button onClick={onCloseModal} className={classes.Button} color="success">
                            Guardar
                        </Button>
                    </div>
                )}
            </div>
            <p align="right" style={{ marginTop: -100 }}>
            <input
                          type="file"
                          id="file"
                          hidden
                          accept=".xlsx, .xls"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            readExcel(file);
                          }}
                        />
                        <Button color="primary" 
            
                          variant='outlined'
                          style={{color: 'white', margin: "10px 0", justifyContent: 'space-around'}}
                          buttonStyle={{ justifyContent: 'flex-end' }}
                          onClick={()=>cargarDatos()}
                        >
                          <Avatar>
                            <img
                              src="/assets/img/excel.png"
                              alt="imagen descriptiva de carga de archivos excel"
                              width="50px;"
                            />
                          </Avatar>
                          Importar Excel
                        </Button>
                        &nbsp;&nbsp;&nbsp;
            <Button buttonStyle={{ justifyContent: 'flex-end' }} color="success" onClick={()=>window.open('https://firebasestorage.googleapis.com/v0/b/micasitaapp-d4b5c.appspot.com/o/documentos%2FFormatoPresupuestar.xlsx?alt=media&token=1cb27498-48a9-4bf8-abd3-18579205efa1', '_blank')}>{/* cambiar esto */}
                  <Avatar>
                    <img
                      src="/assets/img/excel.png"
                      alt="imagen descriptiva de carga de archivos excel"
                      width="50px;"
                    />
                  </Avatar>
                  Descargar Formato
                </Button>
            </p><p className={classes.titulo} style={{ marginTop: -30 }}>Ingresos </p>
            <TableContainer component={Paper}>
                <Table className={classes.table} stickyHeader aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {columnsR.map((column, index) => (
                                <StyledTableCellcian align="center" key={"mainRowIng" + index}>
                                    {column.label}
                                </StyledTableCellcian>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubIng !== undefined && rubIng
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, indexPrin) => {
                                return (
                                    <Fragment>
                                        <Row data={{ ...row, indexPrin, validator, "handleC": handleChangeIng, "val": "valIng_" }} clasStyle={classes.anio} key={indexPrin} />
                                    </Fragment>
                                );
                            })}
                    </TableBody>
                    {validator && (
                        <TableHead>
                            <TableRow>
                                <StyledTableCellcian align="center">TOTAL</StyledTableCellcian>
                                <StyledTableCellWhite align="center">{"$ " + presIng[0]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[1]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[2]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[3]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[4]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[5]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[6]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[7]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[8]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[9]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[10]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presIng[11]}</StyledTableCellWhite>
                                <StyledTableCellcian align="center">{"$ " + presIng[12]}</StyledTableCellcian>
                            </TableRow>
                        </TableHead>)}
                </Table>
            </TableContainer>

            <p className={classes.titulo}>Egresos</p>
            <TableContainer component={Paper}>
                <Table stickyHeader className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {columnsR.map((column, index) => (
                                <StyledTableCellrosa align="center" key={"mainRowEgr" + index}>
                                    {column.label}
                                </StyledTableCellrosa>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubEgr !== undefined && rubEgr
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, indexPrin) => {
                                return (
                                    <Fragment>
                                        <Row data={{ ...row, indexPrin, validator, "handleC": handleChangeEgr, "val": "valEgr_" }} clasStyle={classes.anio} key={indexPrin} />
                                    </Fragment>
                                );
                            })}
                    </TableBody>
                    {validator && (
                        <TableHead>
                            <TableRow>
                                <StyledTableCellrosa align="center">TOTAL</StyledTableCellrosa>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[0]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[1]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[2]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[3]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[4]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[5]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[6]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[7]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[8]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[9]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[10]}</StyledTableCellWhite>
                                <StyledTableCellWhite align="center">{"$ " + presEgr[11]}</StyledTableCellWhite>
                                <StyledTableCellrosa align="center">{"$ " + presEgr[12]}</StyledTableCellrosa>
                            </TableRow>
                        </TableHead>)}
                </Table>
            </TableContainer>
            <div className={classes.fin}>
                <div className={classes.sobre2}>
                    <Button onClick={presupuestarRubros} className={classes.Button} color="primary">
                        Calcular
                    </Button>
                    {validator && (
                        <Button onClick={limpiar} className={classes.Button} color="success">
                            Editar
                        </Button>
                    )}
                </div>
                <div className={classes.sobre2}>
                    {   
                        validator &&
                        (
                            <Fragment >
                                
                                <p className={classes.titulo}>Guardar Presupuesto</p>

                                <Button onClick={onCloseModal} className={classes.Button} color="success">
                                    Guardar
                                </Button>
                                <Dialog
                                    open={openModal}
                                    onClose={onCloseModal}
                                    aria-labelledby="name-pres-modal"
                                >
                                    <DialogTitle id="name-pres-modal">Guardar nombre del Presupuesto</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>Nuevo Presupuesto:</DialogContentText>
                                        <Formik
                                            initialValues={{ nombrePresu: "" }}
                                            onSubmit={(values, { setSubmitting }) => {
                                                setSubmitting(true);
                                                if (formulario2 !== "-") {
                                                    var strIng = [];
                                                    var strEgr = [];
                                                    rubIng.forEach(el => {
                                                        strIng.push({
                                                            Nombre: el.Nombre,
                                                            Valor: el.Valor,
                                                            SubRubros: el.SubRubros
                                                        });
                                                    });
                                                    rubEgr.forEach(el => {
                                                        strEgr.push({
                                                            Nombre: el.Nombre,
                                                            Valor: el.Valor,
                                                            SubRubros: el.SubRubros
                                                        });
                                                    });
                                                    let aceptName = verificarNombre(values.nombrePresu)

                                                    if(!aceptName){
                                                        var presJson = {
                                                            Nombre: values.nombrePresu,
                                                            Fecha: FirestoreService.getFecha(new Date()),
                                                            Anio: formulario2,
                                                            Datos: JSON.stringify({
                                                                ing: strIng,
                                                                egr: strEgr
                                                            })
                                                        };
                                                        try {
                                                            FirestoreService.newPresupuesto(settings.idConjunto, presJson).then((docRef) => {
                                                                if (docRef) {
                                                                    enqueueSnackbar("Registro añadido correctamente", {
                                                                        variant: "success",
                                                                    });
                                                                    onCloseModal();
                                                                    setSubmitting(false);
                                                                    let path = "/administrador/presupuestar"; 
                                                                    history.push(path);
                                                                }
                                                            });
                                                        } catch (error) {
                                                            enqueueSnackbar("Ocurrió un error al crear el presupuesto", {
                                                                variant: "error",
                                                            });
                                                            setSubmitting(false);
                                                        }
                                                    } else {
                                                        enqueueSnackbar("El nombre ya existe! Por favor Ingrese uno Diferente", {
                                                            variant: "warning",
                                                        });
                                                        setSubmitting(false);
                                                    }
                                                } else {
                                                    enqueueSnackbar("Establecer el Año del Presupuesto", {
                                                        variant: "warning",
                                                    });
                                                    setSubmitting(false);
                                                }

                                            }}
                                            validationSchema={Yup.object().shape({
                                                nombrePresu: Yup.string()
                                                    .required("¡Se requiere rellenar este campo!"),
                                            })}
                                        >
                                            {props => {
                                                const {
                                                    values,
                                                    touched,
                                                    errors,
                                                    isSubmitting,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                } = props;
                                                return (
                                                    <form onSubmit={handleSubmit}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} lg={12}>
                                                                <TextField
                                                                    error={errors.nombrePresu && touched.nombrePresu}
                                                                    id="nombrePresu"
                                                                    label="Nombre"
                                                                    name="nombrePresu"
                                                                    fullWidth="true"
                                                                    placeholder="Ingresa un texto"
                                                                    variant="outlined"
                                                                    value={values.nombrePresu}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText={errors.nombrePresu && touched.nombrePresu && errors.nombrePresu}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <DialogActions>
                                                            <Button type="submit" disabled={isSubmitting} color="success">
                                                                Guardar Presupuesto
                                                            </Button>
                                                        </DialogActions>
                                                    </form>
                                                );
                                            }}
                                        </Formik>
                                    </DialogContent>
                                </Dialog>
                            </Fragment>
                        )
                    }
                </div>
            </div>
        </Fragment>
    );
}

export default Presupuestar;
