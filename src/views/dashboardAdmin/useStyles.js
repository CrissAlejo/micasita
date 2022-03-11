import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: "flex;",
    flexWrap: "wrap;",

  },
  pageName: {
    paddingTop: theme.spacing(3),
    font: "var(--unnamed-font-style-normal) normal bold 30px/34px var(--unnamed-font-family-arial)",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "var(--unnamed-color-ffffff)",
    opacity: 1,
  },
  link: {
    color: "var(--unnamed-color-ffffff)",
    textDecoration: "none",
  },
  sobreDos: {
    width: "48%",
    position: "relative",
    display: "inline-block",
    textAlign: "center",
    overflow: "hidden",
  },
  cien: {
    width: "100%",
    position: "relative",
    display: "inline-block",
    textAlign: "center",
    overflow: "hidden",
  },
  titulo: {
    paddingTop: theme.spacing(3),
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "#051e34",
    textAlign: "center",
    fontSize: "5vh",
    fontWeight: "bold",
    opacity: 1,
    margin: "30px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  subtituloCon: {
    paddingTop: theme.spacing(3),
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "#ff4957",
    padding: "0px 15px",
    fontSize: "3vh",
    fontWeight: "bold",
    opacity: 1,
    margin: "30px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  subtituloSin: {
    paddingTop: theme.spacing(3),
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "#00a9db",
    padding: "0px 15px",
    fontSize: "3vh",
    fontWeight: "bold",
    opacity: 1,
    margin: "30px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  table: {
    height: "100%",
    margin: "30px 0px",
  },
  estadook: {
    backgroundColor: '#95D890',
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center'
  },
  estadoerror: {
    backgroundColor: '#FBD469',
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center'
  }
}));
export default useStyles;
