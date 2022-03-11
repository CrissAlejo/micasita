import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0,3,3,3),
    width:'100%',
  },
  table: {
    minWidth: 700,
  },
}));
export default useStyles;