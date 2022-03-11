import React, { Fragment } from 'react';
import "./dashboard.css";
import PropTypes from "prop-types";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Typography,
  makeStyles,
  Card
} from '@material-ui/core';
import Page from '../../components/Common/Page';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  pageName: {
    paddingTop: theme.spacing(3),
    font: "var(--unnamed-font-style-normal) normal bold 30px/34px var(--unnamed-font-family-arial)",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "var(--unnamed-color-ffffff)",
    opacity: 1,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Mi casita" >
      <Container maxWidth="lg">
        <Fragment>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" >
            <Typography className={classes.pageName} >Resumen </Typography>
          </Breadcrumbs>
        </Fragment>
        <Box mt={3}>
          <Card>
            <Grid container>
            </Grid>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};
Dashboard.propTypes = {
  children: PropTypes.node,
};

export default Dashboard;
