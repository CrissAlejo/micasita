import React from "react";
import NoData from "./NoData";
import { Typography, makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width:"100%",
  },
}));
const NoInfo = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NoData />
      <Typography variant="h6"  color="textPrimary">
        No se encontraron datos
      </Typography>
    </div>
  );
};

export default NoInfo;
