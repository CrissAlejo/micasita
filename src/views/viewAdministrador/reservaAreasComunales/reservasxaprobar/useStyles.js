import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    minHeight:'100%',
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
  absoluteCenter: {
    display : 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh'
  }
}));
export default useStyles;
