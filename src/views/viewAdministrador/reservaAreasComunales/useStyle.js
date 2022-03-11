import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
      width: "100%",
      minHeight: '100%',
      padding: '20px',
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "start",
    },
    container: {
      margin: '20px',
      height: "fit-content",
    },
});

export default useStyles;