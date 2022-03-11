import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  stepper: {
    padding: theme.spacing(3, 5, 5, 5)
  },
  pl: {
    paddingLeft: "10px"
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}));
export default useStyles;