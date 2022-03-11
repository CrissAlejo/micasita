import { makeStyles } from "@material-ui/core";
import { Fullscreen } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height:'100%',
    width:'100%'
  },
  pageName: {
    paddingTop: theme.spacing(3),
    font: "var(--unnamed-font-style-normal) normal bold 30px/34px var(--unnamed-font-family-arial)",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "var(--unnamed-color-ffffff)",
    opacity: 1,
  },
  table: {
    minWidth: 700,
  },
  estadook:{
    backgroundColor:'#95D890',
    height:'100%',
    width:'100%',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    alignSelf:'center'
  },
  estadoerror:{
    backgroundColor:'#FF0000',
    color: '#FFFFFF',
    height:'100%',
    width:'100%',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    alignSelf:'center'
  }
}));
export default useStyles;
