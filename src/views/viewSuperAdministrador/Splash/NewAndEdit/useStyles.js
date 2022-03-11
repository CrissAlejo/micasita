import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: "none",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      opacity: 0.5,
      cursor: "pointer",
    },
  },
  dragActive: {
    backgroundColor: theme.palette.action.active,
    opacity: 0.5,
  },
  image: {
    width: 130,
  },
  info: {
    marginTop: theme.spacing(1),
  },
  list: {
    maxHeight: 320,
  },
  actions: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  editor: {
    "& .ql-editor": {
      height: 100,
    },
  },
  close: {
    backgroundColor: "transparent",
    border: 0,
    position: "absolute",
    top: 0,
    right: 0,
    padding: "25px",
    fontSize: 30,
  },
  divclases: {
    flexDirection: "row",
  },
  pageName: {
    paddingTop: theme.spacing(3),
    fontFamily: "Open Sans",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "#000000",
    textAlign: "Center",
    fontSize: 30,
  },

  pageNameDetalle: {
    fontFamily: "Open Sans",
    textAlign: "Center",
    margin: "5px",
    color: "#000000",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    height: "100%",
    width: "50%",
    right: 0,
    position: "fixed",
    margin: "auto",
    overflow: "scroll",
  },
  largeIcon: { width: 160, height: 160 },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
export default useStyles;
