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
  estadoerror:{
    backgroundColor:'#FBD469',
    height:'100%',
    width:'100%',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    alignSelf:'center'
  }
}));
export default useStyles;