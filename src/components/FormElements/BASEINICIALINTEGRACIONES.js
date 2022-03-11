import React, { useState, useEffect, Fragment } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
    Box,
    Breadcrumbs,
    Container,
    Grid,
    Link,
    Typography,
    makeStyles,
    Divider,
    Tabs,
    Tab,
    Card,
    Button
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Page from 'src/components/Page';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
        
    },
    ColorButtonOnSelect: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        background: 'black',
        color: 'white'
    },
    ColorButtonOffSelect: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        background: 'white',
        color: 'black'
    },
}));

const Proveedores = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [currentTab, setCurrentTab] = useState('Proveedores');

    const handleTabsChange = (value) => {
        setCurrentTab(value);
    };

    return (
        <Page className={classes.root} >
            <Container maxWidth="lg">
                <Fragment>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" >
                        <Typography variant="body1" color="textPrimary" > Proveedores </Typography>
                    </Breadcrumbs>
                </Fragment>
                <Box mt={3}>
                    <Card>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} >
                                <Box ml={3}>
                                    <Grid item md={6} xs={12} >
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12} >
                                                <Button className={classes[currentTab === 'Proveedores' ? "ColorButtonOnSelect" : "ColorButtonOffSelect"] }   onClick={() => handleTabsChange('Proveedores')} fullWidth size="large" variant="contained" >
                                                    Proveedores
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} xs={12} >

                                    </Grid>
                                </Box>
                                <Divider />
                                {/* {currentTab === 'Proveedores' &&
                                    <MembresiasTotal />
                                } */}
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </Container>
        </Page>
    );
};


export default Proveedores;
