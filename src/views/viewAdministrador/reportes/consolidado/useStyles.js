import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0,2,3,2),
    width:'100%'
  },
  table: {
    minWidth: '700px',
  },
  banner: {
    margin: theme.spacing(2)
  }
}));
export default useStyles;