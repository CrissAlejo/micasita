import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import bgImage from "../../assets/img/nav_nachos@2x.png";

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
const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const [image] = React.useState(bgImage);
  let classWrapper = classes.wrapper;
  let classRoot = classes.rootAdmin;

  return (
    <div className={classRoot}>
      <TopBar />

      <NavBar
        image={image}
      />

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
