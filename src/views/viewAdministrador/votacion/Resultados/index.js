import React, { useEffect, useState } from 'react';
import BarChartIcon from '@material-ui/icons/BarChart';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Dialog, Grid, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';
import { Bar } from 'react-chartjs-2';
import Votantes from './Votantes';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: '#0B2F4E'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    chart: {
        padding: theme.spacing(2),
    },
    fin:{
        backgroundColor:'#95D890',
        padding: '10px',
        alignContent:'center',
        alignItems:'center',
        textAlign:'center',
        alignSelf:'center'
    },
    continue:{
        backgroundColor:'#e74c3c',
        padding: '10px',
        alignContent:'center',
        alignItems:'center',
        textAlign:'center',
        alignSelf:'center'
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function Resultados({data}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [preguntas] = useState(data.Preguntas);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const dataFormat = (index)=>{
        const pregunta = Object.keys(preguntas)[index];
        const opciones = Object.values(preguntas)[index];
        return {
            labels: Object.keys(opciones),
            datasets: [
                {
                    label: pregunta,
                    data: Object.values(opciones),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                      ],
                      borderWidth: 1,
                }
            ]
        }
    }

    return (
        <>
            <Tooltip title="Ver resultados">
                <IconButton
                    onClick={handleOpen}
                    color='primary'
                >
                    <BarChartIcon/>
                </IconButton>
            </Tooltip>
            
            {open && (
                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {data.Titulo}
                            </Typography>
                            <Votantes participantes={data.Participantes}/>
                            <Typography variant="h6" className={data.Finalizada ? classes.fin : classes.continue}>
                                {data.Finalizada ? 'Finalizada' : 'En curso'}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Grid container>
                        {Object.keys(preguntas).map((el, ind) => (
                            <Grid key={ind} item xs={12} sm={6} className={classes.chart}>
                                <Bar data={dataFormat(ind)}
                                    options={{
                                        scales: {
                                          y: {
                                            stacked: true,
                                            ticks: {
                                              beginAtZero: true
                                            }
                                          },
                                          x: {
                                            stacked: true
                                          }
                                        },
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: el.toUpperCase(),
                                                padding: {
                                                    top: 10,
                                                    bottom: 10
                                                },
                                                fullSize: true,
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    
                </Dialog>
            )}
        </>
    );
}