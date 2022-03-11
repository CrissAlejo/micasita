import React, { useEffect } from 'react';
import { LinearProgress, makeStyles } from "@material-ui/core";
import NProgress from 'nprogress';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: '100%',
    width:'100%',
    padding: theme.spacing(30)
  },
}));
const LoadingData = () => {
  const classes = useStyles();

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);
  return (
    <div className={classes.root}>
            <LinearProgress />

    </div>
  );
};

export default LoadingData;
