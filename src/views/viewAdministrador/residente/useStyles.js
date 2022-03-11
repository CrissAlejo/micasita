import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0,2,3,2),
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
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
}));
export default useStyles;
