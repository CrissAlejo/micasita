import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0,3,3,3),
    width:'100%',
    minHeight: '100%',
  },
  table: {
    minWidth: 700,
  },
  fade: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    height:'100%',
    width:'50%',
    right: 0,
    position: 'fixed',
    margin: 'auto',
    overflow: 'scroll'
  },
  modal:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}));
export default useStyles;