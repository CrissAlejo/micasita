import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import bgImage from "../../assets/img/nav_nachos@2x.png";
import useSettings from "../../contextapi/hooks/useSettings";
import useAuth from "../../contextapi/hooks/useAuth";
const Swal = require("sweetalert2");
import { useSnackbar } from "notistack";
import "bootstrap/dist/css/bootstrap.min.css";
import * as FirestoreService from "../../views/viewAdministrador/mantenimiento/services/firestore";
import * as FirestoreService1 from "../../views/viewAdministrador/issuesReport/services/firestore";
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  rootAdmin: {
    background: "#fffff",
    display: "flex",
    height: "100%",
    width: "100%",
  },
  rootAsociado: {
    background:
      "transparent radial-gradient(closest-side at 50% 50%, #003C6B 0%, #001E36 100%) 0% 0% no-repeat padding-box",
    border: "1px solid #707070",
    opacity: 1,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  rootVendedor: {
    border: "1px solid var(--unnamed-color-707070)",
    background:
      "transparent linear-gradient(51deg, #707070 0%, #6F6F7A 14%, #6F6F7B 16%, #6B6CB0 100%) 0% 0% no-repeat padding-box",
    opacity: 1,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 40,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 256,
    },
    marginTop: theme.spacing(5),
  },
  wrapperAsociado: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
    marginTop: theme.spacing(5),
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
  },
}));
const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [image] = React.useState(bgImage);
  const { settings } = useSettings();
  const { settings1 } = useSettings();
  const [imagen, setImagen] = React.useState('');
  let classWrapper = classes.wrapper;
  let classRoot = classes.rootAdmin;
  const [usuario2, setUsuarios2] = React.useState([]);
  const [usuario3, setUsuarios3] = React.useState([]);
  const [login, setLogin] = React.useState(true);
  const getConjuntoById = React.useCallback(() => {
    
    try {
      setLogin(true);
     FirestoreService.getUserByConjunto3(settings.idConjunto,
      {
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          setUsuarios2(Items);
          if (Items.length > 0) {
            enqueueSnackbar("Mantenimientos Pendientes", {
              variant: "error",
            });
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
            swalWithBootstrapButtons
            .fire({
              title: "Existen mantenimientos Pendientes",
              text: Items[0]?.data().Detalle,
              icon: "warning",
              imageUrl: Items[0]?.data().Imagen,
              imageWidth: 400,
              imageHeight: 200,
              confirmButtonText: "Detalle",
            })
            .then((result) => {
              if (result.isConfirmed) {
                history.push(`/administrador/mantenimiento`);
                
              }
            });
          }
         
        },
      },
      );

      FirestoreService1.getAlertareporte(settings.idConjunto,
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios3(Items);
          
            if (Items.length > 0) {
              enqueueSnackbar("Reporte de Daños Pendientes", {
                variant: "error",
              });
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
              });
              swalWithBootstrapButtons
              .fire({
                title: "Reporte de Daños Pendientes",
                text: Items[0]?.data().Detalle,
                icon: "warning",
                imageUrl: Items[0]?.data().Imagen,
                imageWidth: 400,
                imageHeight: 200,
                confirmButtonText: "Detalle",
              })
              .then((result) => {
                if (result.isConfirmed) {
                  history.push(`/administrador/informeProblemas`);
                  
                }
              });
            }
           
          },
          
        },
       
        );  
    } catch (e) {}
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]) ;
  return (
    <div className={classRoot}>
      <TopBar img={settings.Imagen} />

      <NavBar image={image} />

      <div className={classWrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  
  children: PropTypes.node,
};

export default DashboardLayout;