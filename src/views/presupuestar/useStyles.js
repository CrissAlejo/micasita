import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  anio: {
    width: "40px"
  },
  fin: {
    marginBottom: "40px",
  },
  contain: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: "flex;",
    flexWrap: "wrap;",
  },
  sobre2: {
    width: "48%",
    position: "relative",
    display: "inline-block",
    textAlign: "left",
    paddingLeft: "25px",
    overflow: "hidden",
  },
  Button: {
    margin: "15px",
  },
  Link: {
    color: "var(--unnamed-color-ffffff)",
    textDecoration: "none",
  },
  root: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: '100%',
    width: '100%'
  },
  pageName: {
    paddingTop: theme.spacing(3),
    font: "var(--unnamed-font-style-normal) normal bold 30px/34px var(--unnamed-font-family-arial)",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "var(--unnamed-color-ffffff)",
    opacity: 1,
  },
  titulo: {
    paddingTop: theme.spacing(3),
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "#051e34",
    textAlign: "left",
    fontSize: "4vh",
    paddingLeft: "20px",
    opacity: 1,
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
    minWidth: 900,
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
