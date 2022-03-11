import React from 'react'
import numeral from "numeral";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";

const ListaPagos = ({title, pagosPendientes}) => {
    const header = ["Nombre", 'Descripción', 'Fecha Límite', "Valor"];
    
    
    return (
        <div>
            <Accordion padding="10px">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography><b>{title}</b></Typography>
              </AccordionSummary>
              <AccordionDetails>
              {pagosPendientes.length>0 ? (
                <TableContainer component={Paper} style={{maxHeight: "40vh"}}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        {header.map((label, i)=>(
                            <TableCell key={i}><b>{label}</b></TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagosPendientes.map((pago) => (
                          <TableRow key={pago.id}>
                            <TableCell width="20%">{pago.data().Nombre}</TableCell>
                            <TableCell width="40%">{pago.data().Descripcion}</TableCell>
                            <TableCell>{new Date(pago.data().FechaLimite.seconds*1000).toLocaleDateString("en-CA")}</TableCell>
                            <TableCell>$ {numeral(pago.data().Valor).format(`${"USD"}0,0.00`)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                ):(
                    <Typography>
                      El Usuario no tiene Deudas
                    </Typography>
                  )}
              </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default ListaPagos;
