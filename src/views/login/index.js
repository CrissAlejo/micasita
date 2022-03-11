import React, { useState } from "react";
import firebase from '../../Firebase';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import useAuth from '../../contextapi/hooks/useAuth';
import useStyles from "./useStyles";

const LoginView = () => {
  const classes = useStyles();

  const errorTrad = {
    'auth/invalid-email': 'Correo electrónico inválido.',
    'auth/user-not-found': 'Este usuario no existe.',
    'auth/wrong-password': 'Contraseña inválida.'
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMSG, setErrorMsg] = useState('');
  const [renderer, setRenderer] = useState(true);
  const { login } = useAuth();

  const submit = async () => {
    await login(email.toLowerCase(), password);


  }
  const forgot = async () => {
    await firebase.auth().sendPasswordResetEmail(email).then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
      .catch((error) => {
        setErrorMsg(errorTrad[error.code] ? errorTrad[error.code] : 'Algo salió mal :/');
      });
  }

  function changeForm() {
    setRenderer(!renderer);
  }

  function componentRenderer() {
    if (renderer) {
      return (
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} >
            {/* <a>¡Vive seguro, vive feliz!</a> */}
          </Grid>
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <img src="/assets/img/mi2.png" alt = "Imagen descriptiva de Mi casita" width="20%;"></img>
              <form className={classes.form} noValidate>
                <TextField variant="outlined" margin="normal"    required fullWidth id="email"
                  label="Correo electrónico" name="email" autoComplete="email" autoFocus
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                <TextField variant="outlined" margin="normal" required fullWidth name="password"
                  label="Contraseña" type="password" id="password" autoComplete="current-password"
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                <Box mt={3}></Box>
                <Typography className={classes.errorMsg} component="h6" variant="h6">{errorMSG}</Typography>
                <Button fullWidth type="submit" variant="contained" color="primary" onClick={submit}>INGRESAR</Button>
                <Box mt={2}></Box>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" onClick={changeForm}>¿Olvidaste tu contraseña?</Link>
                  </Grid>
              
                </Grid>
                <Box mt={5}></Box>
              </form>
            </div>
          </Grid>
      
        </Grid>
      )
    } else {
      return (
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <div className={classes.paper}>

              <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>
              <Typography component="h1" variant="h5"> Recuperar Contraseña</Typography>

              <form className={classes.form} noValidate>
                <TextField variant="outlined" margin="normal" required fullWidth id="email"
                  label="Correo electrónico" name="email" autoComplete="email" autoFocus
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                <Box mt={2}></Box>
                <Typography className={classes.errorMsg} component="h6" variant="h6">{errorMSG}</Typography>
                <Button fullWidth variant="contained" color="primary" onClick={forgot}>Enviar Correo</Button>
                <Box mt={2}></Box>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" onClick={changeForm}>Regresar</Link>
                  </Grid>
                </Grid>
                <Box mt={5}></Box>
              </form>
            </div>
          </Grid>
        </Grid>
      )
    }
  }

  return componentRenderer();
}
export default LoginView;
