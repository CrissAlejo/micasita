import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width:'100%'
  },
  table: {
    minWidth: 700,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  opt: {
    margin : '0 10px',
  },
  der: {
    right: 'auto !important'
  },
  item:{
    padding: '0px 12px !important',
  },
  banner: {
    justifyContent: 'space-around',
    marginBottom: '10px'
  }
}));
export default useStyles;