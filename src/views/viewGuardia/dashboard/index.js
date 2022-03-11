import React from "react";
import Avatar from '@material-ui/core/Avatar';
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import Page from "../../../components/Common/Page";
import useStyles from "./useStyles";
import CreateForm from "../bitacoraDigital/New/CreateForm";
import ListaEntradasPendientes from "../bitacoraDigital/ListEntradas/ListarEntradas";
import HomeIcon from '@material-ui/icons/Home';
import { Grid } from "@material-ui/core";
const Dashboard = () => {
  const classes = useStyles();


  return (
    <Page className={classes.root} title="Mi casita">
      <CreateForm />
      <ListaEntradasPendientes />
    </Page>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node,
};

export default Dashboard;
