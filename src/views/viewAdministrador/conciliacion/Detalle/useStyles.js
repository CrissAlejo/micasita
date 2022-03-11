import { makeStyles } from "@material-ui/core";
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
}));
export default useStyles;
