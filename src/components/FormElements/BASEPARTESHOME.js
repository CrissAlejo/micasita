import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Box,
    Container,
    Grid,
    Typography,
    makeStyles,
    Paper,
    Button,
    Card
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {

    }
}));

const Adquirir = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box pt={5}>
            </Box>
        </div>
    );
};

export default Adquirir;
