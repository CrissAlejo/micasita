import React, { useEffect, useState } from 'react'
import { Backdrop, Box, CircularProgress, Container, Fade, Grid, IconButton, Modal, Radio, TextField, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { green } from '@material-ui/core/colors';
import Header from '../../aprobacionDePagos/ConfirmarTransferencia/Header';
import Button from "../../../../components/CustomButtons/Button";
import { useSnackbar } from "notistack";
import Page from 'src/components/Page';
import useStyles from '../Styles';
import { Formik } from 'formik';
import * as Yup from "yup";
import * as FirestoreService from '../service/firestore'
import moment from "moment";
import useSettings from 'src/contextapi/hooks/useSettings';
var ServidorFCM = require('node-gcm');
const Question = ({max, send}) => {
    const [numQuestions, setNumQuestions] = useState([{Pregunta: '', Opciones:['','']}]);
    const [limite, setLimite] = useState(max+1)
    const { enqueueSnackbar } = useSnackbar();
    function handleChangeQuestion(index, value) {
        const values = [...numQuestions];
        values[index].Pregunta = value.trim().replace(/[&\/\\#,+()$~%.'":;\-*<>{}@\[\]]/g, '');
        setNumQuestions(values);
    }
    function handleAddQuestion() {
        if(limite >= 50 || numQuestions.length >= 4){
            enqueueSnackbar("Límite de preguntas alcanzado, No puedes añadir más preguntas", {
                variant: "error",
            })
        }else{
            setNumQuestions([...numQuestions, {Pregunta: '', Opciones:['','']}])
            setLimite(limite +1);
        }
    }
    function handleRemoveQuestion(index) {
        const values = [...numQuestions];
        values.splice(index,1);
        setNumQuestions(values);
        setLimite(limite -1);
    }
    const handleChangeInput = (index, op, value) => {
        const values = [...numQuestions];
        values[index]['Opciones'][op] = value.trim().replace(/[&\/\\#,+()$~%.'":;\-*<>{}@\[\]]/g, '');
        setNumQuestions(values);
    }
    const handleAddOption = (index) => {
        const values = [...numQuestions];
        values[index].Opciones.push('');
        setNumQuestions(values)
    }
    const handleRemoveOption = (index, op) => {
        const values = [...numQuestions];
        values[index].Opciones.splice(op,1);
        setNumQuestions(values);
    }
    return (
        <>
        <Grid item xs={12}>
            <h6>Preguntas</h6>
        </Grid>
        {numQuestions.map((item, ind) => (
            <>
            <Grid item xs={12} sm={12}>
                <Grid container>
                <Grid item xs>
                <TextField
                    size='small'
                    label={`Pregunta ${ind+1}`}
                    name='Pregunta'
                    variant='outlined'
                    color='primary'
                    fullWidth
                    value={item.Pregunta}
                    onChange={(e) => handleChangeQuestion(ind,e.target.value)}
                    helperText="no se permiten caracteres especiales (. , @ ' ' '' '')"
                />
                </Grid>
                {numQuestions.length > 1 && (
                <Grid item xs={1}>
                    <IconButton
                        onClick={() => handleRemoveQuestion(ind)}
                    >
                        <DeleteIcon color='error'/>
                    </IconButton>
                </Grid>
                )}
                </Grid>
            </Grid>
            {item.Opciones.map((opt, i) => (
                <Grid item xs={6} sm={6} key={i}>
                    <Radio/>
                    <TextField
                        size='small'
                        label={`Opción ${i+1}`}
                        name='val'
                        color='primary'
                        value={opt}
                        onChange={(e) => handleChangeInput(ind,i,e.target.value)}
                        helperText="no se permiten caracteres especiales (. , @ ' ' '' '')"
                    />
                    {item.Opciones.length > 2 && (
                        <IconButton
                        onClick={() => handleRemoveOption(ind,i)}
                    >
                        <RemoveIcon color='secondary'/>
                    </IconButton>
                    )}
                    {item.Opciones.length < 6 && (
                        <IconButton
                        onClick={()=>handleAddOption(ind)}
                    >
                        <AddIcon style={{ color: green[500] }}/>
                    </IconButton>
                    )}
                </Grid>
            ))}
            </>
        ))}
        <Grid item xs={12} sm={12}>
            <Button
                variant='outlined'
                color='danger'
                onClick={()=>handleAddQuestion()}>
                agregar pregunta
            </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
            <Button
                fullWidth
                type='Submit'
                onClick={()=>send(numQuestions)}
                variant='outlined'
                color='primary'>
                enviar votación
            </Button>
        </Grid>
        </>
    )
}
const New = ({limite}) => {
    const [loading, setLoading] = useState(false);
    const { settings } = useSettings();
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [attachFiles, setAttachFiles] = useState([]);
    const [date, setDate] = useState(null);
    const [usuario, setUsuarios] = React.useState([]);
    const classes = useStyles();
    function enviarnotificacionFCM (){
        var ntoken = "";
        var conjunto = "";
        var stokens = "";
        var token = [];
        var rol="";
            FirestoreService.get_token(
                {
                    next: querySnapshot => {
                        const items = querySnapshot.docs.map(docSnapshot => docSnapshot);
                        setUsuarios(items);
                    },
                }
            );
        usuario.forEach(document=>{
            conjunto = document.data().ConjuntoUidResidencia;
            rol = document.data().Rol;
            if(conjunto === settings.idConjunto){
                if (JSON.parse(document.data().Rol).residente === true || JSON.parse(document.data().Rol).administrador === true){
          
                ntoken = document.data().tokens;
                if(ntoken != null ){
               stokens = ""+ntoken;
                if(stokens.indexOf(",")){
                    var strArr = stokens.split(',');
                    var i=0;
                    for(i=0; i < strArr.length; i++)
                    token.push(strArr[i]);
                }
            }}
            }
        })
        let result = token.filter((item,index)=>{
            return token.indexOf(item) === index;
          }) 
        var sender = new ServidorFCM.Sender ('AAAAQSgq8kc:APA91bHQmE-lNIrpVPsKXddyaxl4TVnNg-G0zlR8mAB9eKMqpdUZYE7Mi043WJWEXEU_DIydiFgy6jv0VqnmZlJZ8WBBhFKL_2NbYKlQ9QtSuJ4W6QtOMNEBix4SENU-rw6xTMx2VOKC');
        var message = new ServidorFCM.Message({
            date: {
                year: 2021,
                month: 11,
                day: 8,
                hour: 16,
                minutes: 35
                },
            notification: {
                title: 'Nueva votación creada',
                body: 'Se ha creado una nueva votación'
            },
            data: {
                your_custom_data_key: 'your_custom_data_value'
            }
        });
        sender.send(message, {registrationTokens: result}, function(err, response)
        {
            if (err) console.error(err);
            else console.log(response);
        });
        console.log(token);
    }
    const handleOpen = () => {
        if(limite>=50){
            enqueueSnackbar("No puedes crear más votaciones", {
                variant: "error",
            })
        } else {
            setOpen(true)
        }
    }
    const handleClose = () => setOpen(false);
    const manageFiles = (e) => {
        // Retrieve all files
        setAttachFiles([]);
        const files = e.target.files;
        // Check files count
        if (files.length > 4) {
            enqueueSnackbar(`Solo puedes subir máximo 4 archivos.`,{variant: 'error'});
            e.target.value = "";
            return;
        }
        let abc = [...files];
        let aprove = true;
        abc.forEach( file => {
            if(file.size > 2000000){
                enqueueSnackbar("El archivo "+file.name+" es demasiado pesado", {variant: 'error'})
               e.target.value = "";
               aprove=false;
            }
        })
        if(!aprove) return;
        // TODO: continue uploading on server
        setAttachFiles(abc);
    }
    const sendVotacion = (values)=>{

        if(Object.values(values).includes('')) return;
        
        const validator = values.preguntas.every( pre => pre.Pregunta== '' || pre.Opciones.includes(''))

        if(validator) {
            enqueueSnackbar('No debe dejar vacío ningun campo de pregunta u opción', {variant: 'error'})
            return;
        }

        setLoading(true);

        values.preguntas = values.preguntas.reduce(function(result, item) {
            var key = Object.values(item)[0]; //primer value (valor de pregunta)
            var value = Object.values(item)[1].reduce(function(acc, cur) {
                acc[cur] = 0; // valor de respuesta = num de votos
                return acc;
            }, {}); //segundo valor (respuesta)
            result[key] = value;
            return result;
          }, {});

        let data={
            Titulo: values.Titulo,
            Inicio: new Date(values.Inicio),
            Fin: new Date(values.Fin),
            Preguntas: values.preguntas,
            Finalizada: false,
            Participantes: [],
        }
        if(attachFiles.length > 0){
            Promise.all(
                attachFiles.map( file => FirestoreService.saveFiles(file, settings.idConjunto))
            ).then( url => {
                FirestoreService.sendVotation(settings.idConjunto,{...data, Archivos: url}).then(()=>{
                    setLoading(false);
                    setAttachFiles([]);
                    enviarnotificacionFCM();
                    enqueueSnackbar("¡Votación creada exitosamente!", { variant: 'success'})
                    handleClose();
                })
            }).catch( error => {
                console.log('error', error.message);
            })
        } else {
            FirestoreService.sendVotation(settings.idConjunto,data).then(()=>{
                setLoading(false);
                setAttachFiles([]);
                enviarnotificacionFCM();
                enqueueSnackbar("¡Votación creada exitosamente!", { variant: 'success'})
                handleClose();
            })
        }
    }
    useEffect(() => {
        FirestoreService.get_token(
            {
                next: querySnapshot => {
                    const items = querySnapshot.docs.map(docSnapshot => docSnapshot);
                    setUsuarios(items);
                },
            }
        );
    }, []);

    return (
        <>
            <Button variant='outlined' color='danger' onClick={handleOpen}>
                Nueva votación
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
                        <Page className={classes.fade} title="Crear Votacion">
                            <Container maxWidth="lg">
                                <Header title='Crear votación' onClick={() => handleClose()} />
                                {!loading ? (
                                    <Formik
                                        initialValues={{
                                            Titulo: '',
                                            Inicio: '',
                                            Fin: '',
                                        }}
                                        validationSchema={Yup.object().shape({
                                            Titulo: Yup.string().required('¡Se requiere llenar este campo!'),
                                            Inicio: Yup.date().required('¡Se requiere llenar este campo!'),
                                            Fin: Yup.date()
                                                .test('fin',
                                                    'La fecha final debe ser mayor a la fecha de inicio',
                                                    (value)=>{
                                                        let valid = false;
                                                        let fecha1 = moment(value);
                                                        let fecha2 = moment(date)
                                                        if (fecha1.diff(fecha2, 'minutes') > 0) {
                                                            valid = true;
                                                        }
                                                        return valid;
                                                    }
                                                )
                                                .required('¡Se requiere llenar este campo!'),
                                        })}
                                        onSubmit={()=>{}}
                                    >
                                        {props => {
                                            const {
                                                values,
                                                touched,
                                                errors,
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                            } = props;
                                            return(
                                                <form onSubmit={handleSubmit}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} sm={12}>
                                                            <TextField
                                                                error={errors.Titulo && touched.Titulo}
                                                                label='Título'
                                                                name="Titulo"
                                                                variant='outlined'
                                                                color='primary'
                                                                fullWidth
                                                                value={values.Titulo}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                helperText={errors.Titulo && touched.Titulo && errors.Titulo}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <TextField
                                                                error={errors.Inicio && touched.Inicio}
                                                                id="datetime-local"
                                                                name='Inicio'
                                                                label="Inicio de la votación"
                                                                type="datetime-local"
                                                                variant='outlined'
                                                                onChange={(e)=> {handleChange(e); setDate(e.target.value)}}
                                                                defaultValue={values.Inicio}
                                                                InputLabelProps={{
                                                                shrink: true,
                                                                }}
                                                                onBlur={handleBlur}
                                                                helperText={errors.Inicio && touched.Inicio && errors.Inicio}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                        {values.Inicio !='' && (
                                                            <TextField
                                                                error={errors.Fin && touched.Fin}
                                                                id="datetime-local2"
                                                                name='Fin'
                                                                label="Fin de la votación"
                                                                type="datetime-local"
                                                                variant='outlined'
                                                                onChange={handleChange}
                                                                defaultValue={values.Fin}
                                                                InputLabelProps={{
                                                                shrink: true,
                                                                }}
                                                                onBlur={handleBlur}
                                                                helperText={errors.Fin && touched.Fin && errors.Fin}
                                                            />
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12} md={12}>
                                                            <input id='inputFile' type='file' onChange={(e)=>manageFiles(e)} multiple hidden/>
                                                            <label htmlFor="inputFile">
                                                            <Button variant="raised" component="span" color={attachFiles.length > 0 ? 'success': null}>
                                                                Subir archivos
                                                            </Button>
                                                            </label>
                                                            {' '}Tamaño máximo de archivo: 2 MB.
                                                            {attachFiles.length > 0 && (
                                                                <Tooltip title="Quitar archivos">
                                                                    <IconButton onClick={()=>setAttachFiles([])}>
                                                                        <DeleteIcon color='error'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Grid>
                                                        <Question max={limite} send={(preguntas)=>sendVotacion({preguntas,...values})}/>   
                                                    </Grid>
                                                </form>
                                            )
                                        }}
                                    </Formik>
                                ) : (
                                    <Box display="flex" justifyContent="center" marginTop='40%'>
                                        <CircularProgress />
                                    </Box>
                                )}
                            </Container>
                        </Page>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}
export default New;