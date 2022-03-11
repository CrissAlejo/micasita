import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0,3,3,3),
    width:'100%',
    minHeight: '100%'
  },
  table: {
    minWidth: 700,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    overflowY: 'scroll',
    padding: theme.spacing(2, 3, 3),
  },
}));
export default useStyles;