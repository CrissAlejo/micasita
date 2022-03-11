import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import bgImage from "../../assets/img/nav_nachos@2x.png";
import useAuth from "../../contextapi/hooks/useAuth";
import * as FirestoreService from "../../views/viewGuardia/alertas/services/firestore";
import { useSnackbar } from "notistack";
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import SplashScreen from "../../components/Common/SplashScreen";

const Swal = require("sweetalert2");
const useStyles = makeStyles((theme) => ({
  rootAdmin: {
    background: "#fffff",
    display: "flex",
    height: "100%",
    width: "100%",
  },
  rootAsociado: {
    background:
      "transparent radial-gradient(closest-side at 50% 50%, var(--unnamed-color-003c6b) 0%, #001E36 100%) 0% 0% no-repeat padding-box",
    border: "1px solid var(--unnamed-color-707070)",

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
const DashboardGuardia = ({ children }) => {
  const history = useHistory();

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [image] = React.useState(bgImage);
  let classWrapper = classes.wrapper;
  let classRoot = classes.rootAdmin;
  const [usuario, setUsuarios] = React.useState([]);
  const [login, setLogin] = React.useState(true);
  //trae la imagen
  const [imagen, setImagen] = React.useState('');

  
  const getConjuntoById = React.useCallback(() => {
    try {
      setLogin(true);
      FirestoreService.getImagen(user.ConjuntoUidResidencia, {
        next: (query) => {
          const item = query.data()
          setImagen(item.Imagen)
          console.log(item)
        }
      })

      FirestoreService.getAlertas(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
            setLogin(false);

            if (Items.length > 0) {
              enqueueSnackbar("Ayuda!!!", {
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
                  title: "Necesito ayuda",
                  text: Items[0]?.data().Detalle,
                  icon: "error",
                  imageUrl: Items[0]?.data().Imagen,
                  imageWidth: 400,
                  imageHeight: 200,
                  confirmButtonText: "Detalle",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    history.push(`/guardia/alerta`);
                    
                  }
                });
            }
          },
        },
        user.ConjuntoUidResidencia
      );
    } catch (e) {}
  }, [user.ConjuntoUidResidencia]);

  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);
  if (login) {
    return <SplashScreen />;
  }
  return (
    <div className={classRoot}>
     
    
      <TopBar img={imagen} />
      
      <NavBar image={image} />

      <div className={classWrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};

DashboardGuardia.propTypes = {
  children: PropTypes.node,
};

export default DashboardGuardia;
