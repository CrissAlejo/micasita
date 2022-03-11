import React, { Fragment, useEffect, useState }  from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import UpdateOutlined from "@material-ui/icons/UpdateOutlined";
import { useSnackbar } from "notistack";
import useAuth from "../../../../contextapi/hooks/useAuth";
import { useDropzone } from "react-dropzone";
import useStyles from "./useStyles";
//firebase
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";
import "moment/locale/es";
import useSettings from "../../../../contextapi/hooks/useSettings";
var ServidorFCM = require('node-gcm');
const CreateForm = (props) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [loading, setloading] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formulario] = React.useState(props.data);
  const [formularios, setFormularios] = React.useState({});
  const [usuario, setUsuarios] = React.useState([]);
  const { settings } = useSettings();


  function enviarnotificacionFCM (values){
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
          }
        }
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
            title: values.Titulo,
            body: values.Mensaje
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
    console.log(rol);
   
}


  const handleDrop = React.useCallback((acceptedFiles) => {
    setFiles([]);
    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  const newData = (values) => {
    FirestoreService.newMensaje(settings.idConjunto,values).then((docRef) => {
      if (docRef) {
        setloading(false);
        enqueueSnackbar("Mensaje enviado con éxito", {
          variant: "success",
        });
        props.send();
      }
    });
  };
  const UpdateData = (values) => {
    
    FirestoreService.updateMensaje(settings.idConjunto,values,formulario.id).then((doc) => {
        console.log(doc);
        setloading(false);
        enqueueSnackbar("Mensaje actulalizado", {
          variant: "success",
        });
        props.send();
      });
  };
  const subirMantenimiento = (values, tipo) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef
        .child(
          values.Titulo,
          values.Mensaje,
          );
          if(tipo == 0)
          {
        newData(values);
        enviarnotificacionFCM(values);
      }else{UpdateData(values);
        enviarnotificacionFCM(values);
      }
      try {
      } catch (error) {
        setloading(false);
      }  
  };
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
    <Formik
      initialValues={{
      
        Titulo: props.data?.data().Titulo || "",
     
        Mensaje: props.data?.data().Mensaje || "",
      }}
      validationSchema={Yup.object().shape({
       
          Titulo: Yup.string().max(20,'Máximo 20 caracteres')
          .required("Se requiere rellenar este campo!"),
         
          Mensaje: Yup.string().max(60,'Máximo 60 caracteres')
          .required("Se requiere rellenar este campo!"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
       // subirMantenimiento(values);
        try {
          if (!props.data?.data()) {
            subirMantenimiento(values, 0);
          } else {
            if (files.length > 0) {
              newData(values, 1);
            {/* Aqui recive el metodo para enviar mensajes*/}


            } else {
              
              UpdateData(values);
              enviarnotificacionFCM(values);
            }
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
          setloading(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <Fragment>
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={clsx(classes.root, props.className)}
              {...props.rest}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <Card>
                    <Divider />
                    <CardContent>
                      
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Titulo && errors.Titulo)}
                          helperText={touched.Titulo && errors.Titulo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Titulo}
                          label="Título del mensaje"
                          placeholder="Título"
                          name="Titulo"
                          id="Titulo"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Mensaje && errors.Mensaje)}
                          helperText={touched.Mensaje && errors.Mensaje}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Mensaje}
                          label="Mensaje"
                          placeholder="Mensaje"
                          name="Mensaje"
                          id="Mensaje"
                          component={renderTextField}
                        />
                      </Grid>
                 
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={2}>
                {props?.data ? (
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    <UpdateOutlined /> Actualizar
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    <AddShoppingCartIcon /> Enviar
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Fragment>
      )}
    </Formik>
  );
};

CreateForm.propTypes = {
  className: PropTypes.string,
};
export default CreateForm;