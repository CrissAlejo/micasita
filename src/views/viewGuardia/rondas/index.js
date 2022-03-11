import React, { useEffect, useState } from 'react'
import LoadingData from 'src/components/Common/LoadingData';
import * as FirestoreService from './service/firestore'
import { Paper, Table,Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@material-ui/core";
import { CardContent, ListItem, Avatar } from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";
import NoInfo from "../../../components/Common/NoInfo";
import DetallesRonda from './DetalleRonda'
import useStyles from './Styles';
import useAuth from 'src/contextapi/hooks/useAuth';
import moment from 'moment';
import SearchBar from "material-ui-search-bar";
import 'moment/locale/es-mx';
import Box from '@material-ui/core/Box';
import PuntosConfig from './PuntosConfig';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const Rondas = () => {
    const [searched, setSearched] = React.useState("");
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [rondas, setRondas] = useState([]);
    const [filteredRondas, setFilteredRondas] = useState([]);
    
    const [usuarios1, setUsuarios1] = useState([]);
    const { user } = useAuth();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const columns = [
        { id: 1, label: "Fecha" },
        { id: 2, label: "Nombre" },
        { id: 3, label: "Duración" },
        { id: 3, label: "Puntos" },
        { id: 5, label: "Acciones" }
    ];

    const viewtabla =()=>{

    }
    const requestSearch = (searchedVal) => {
      
        const filteredRows = rondas.filter((row) => {
            return moment(row.data()
                .Fecha.toDate()).format('ddd DD-MM-YY hh:mm A').includes(searchedVal) || row.data()
            .Nombre?.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
            .Puntos.includes(searchedVal)
          });
         setFilteredRondas(filteredRows);
         setPage(0);
      };
    
      const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
      };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        try {
 
            FirestoreService.getRondas(user.ConjuntoUidResidencia,
                {
                  next: (querySnapshot) => {
                    const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
                    setRondas(Items);
                    setFilteredRondas(Items);
                  },
                } 
                );
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }, []);
    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: "#0B2F4E",
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 14,
        },
      }))(TableCell);
      const StyledTableRow = withStyles((theme) => ({
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);

    function timeFormat(item){
        const time = moment(new Date(item.Fecha.seconds*1000)).diff(moment(new Date(item.Ruta[0].fecha.seconds*1000)), 'minutes');
        if(time < 0){
            return '0 minutos'
        }else if(time < 60){
            return time + ' minutos';
        } else {
            let hours = Math.floor(time / 60);
            let minutes = time % 60;
            if(minutes<10){
                minutes = '0'+minutes;
            }
            return `${hours}:${minutes} hrs.`
        }
    }
    return (
        loading?(
          <LoadingData />
        ):(
            <Paper className={classes.root}>
                <Grid xs={12}>
                    <center>
                        <h3>Historial de Rondas</h3>
                    </center>
                </Grid>
            <PuntosConfig/>
            <div style={{ float: "right" }}>
                <ListItem>
                    <Avatar>
                        <img
                            src="/assets/img/excel.png"
                            alt="imagen descriptiva de carga de archivos excel"
                            width="50px;"
                        />
                    </Avatar>
                    <ReactHTMLTableToExcel
                    id="export_Rondas"
                    className={"btn btn-success"}
                    table="table_Rondas"
                    filename="Historial de Rondas"
                    sheet="tablexls"
                    buttonText="Exportar"
                    />
                </ListItem>
            </div>
            {rondas  ?(
                <Box mt ={2}> 
                   <SearchBar
                   value={searched}
                  onChange={(searchVal) => requestSearch(searchVal)}
                  onCancelSearch={() => cancelSearch()}
                 /> 
                <TableContainer component={Paper}>
                    <Table className={classes.table} id='table_Rondas' size='small' aria-label="tabla de rondas">
                        <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                            <StyledTableCell align="center" key={column.id}>
                                {column.label}
                            </StyledTableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRondas
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map( (ronda, ind) => {
                                const data = ronda.data();
                                return (
                                    <StyledTableRow hover tabIndex={-1} key={ind}>
                                        <StyledTableCell align="center">
                                            {moment(data.Fecha.toDate()).format('ddd DD-MM-YY hh:mm A')}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {data.Nombre}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {timeFormat(data)}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                              { data.Puntos}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <DetallesRonda
                                                ronda={data}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Box>
                 ):(
                    <center>
                      <NoInfo/>
                    </center>  
                  )}
                <TablePagination
                    labelRowsPerPage={"Filas por página"}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRondas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        )
        )
   
}

export default Rondas
