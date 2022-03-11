import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0,2,3,2),
    height:'100%',
    width:'100%'
  },
  table: {
    minWidth: 700,
  },
}));
export default useStyles;
