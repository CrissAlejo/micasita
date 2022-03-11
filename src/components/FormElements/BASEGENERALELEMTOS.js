import React, { useState, useEffect, Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Link,
    Typography,
    makeStyles,
    Divider,
    Tabs,
    Tab,
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useDispatch, useSelector } from 'src/store';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Membresias = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    return (
        <Fragment>
            <Container maxWidth="lg">
                <Box mt={3}>
                    <Grid container>
                        <Grid item md={12} xs={12} >

                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Fragment>
    );
};


export default Membresias;
