import React, { useEffect, useRef, useState } from 'react'
import { IconButton, Popover, List, ListItem, ListItemText, Box, CircularProgress } from '@material-ui/core';
import ContactsIcon from '@material-ui/icons/Contacts';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import NextIcon from '@material-ui/icons/ArrowForwardIos';
import { getUsuario } from '../service/firestore';
import Tooltip from '@material-ui/core/Tooltip';

const Votantes = ({participantes}) => {
    const [prev, setPrev] = useState(0);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const ref = useRef(null);

    useEffect(() => {
        if(show) getUsr();
        return () => {
            setUsuarios([]);
        }
    }, [show, prev])

    async function getUsr(){
        setLoading(true);
        let partUsr = [...participantes];
        partUsr = partUsr.splice(prev,10)
        let users= [];
        for(let i = 0 ; i<partUsr.length; i++){
            const doc = await getUsuario(partUsr[i])
            users.push(doc.data())
        }
        setUsuarios(users);
        setLoading(false);
    }

    const increment = () => {
        if(prev < participantes.length){
            setPrev(prev+10);
        } else {
            setPrev(0);
        }
    }
    const decrement = () => {
        if(prev <=0){
            setPrev(0);
        } else {
            setPrev(prev-10);
        }
    }

    return (
        <>
            <Tooltip title='Lista de votantes'>
                <IconButton edge="start" ref={ref} onClick={()=> setShow(!show)} style={{color: 'white'}}>
                    <ContactsIcon/>
                </IconButton>
            </Tooltip>
            <Popover
                open={show}
                anchorEl={ref.current}
                onClose={()=> setShow(false)}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                style={{width: 320}}
            >
                {!loading ? (
                    <List component="div" disablePadding style={{ minWidth: 400 }}>
                        <ListItem>
                            <ListItemText secondary='Lista de votantes'/>
                        </ListItem>
                    {usuarios.length > 0 ? usuarios.map( (user, ind) => (
                        <ListItem key={ind}>
                            <ListItemText primary={`${user.Nombre} ${user.Apellido} ${user.Casa}`} />
                        </ListItem>
                    )):(
                        <ListItem>
                            <ListItemText primary="No se registrans votantes" />
                        </ListItem>
                    )}
                    </List>
                ):(
                    <Box display="flex" justifyContent="center" marginTop='40%'>
                        <CircularProgress />
                    </Box>
                )}
                <Box display='flex ' justifyContent='space-between'>
                    {prev!=0 && (
                        <IconButton onClick={increment}>
                            <BackIcon/>
                        </IconButton>
                    )}
                    {prev <= participantes.length && (
                        <IconButton onClick={decrement}>
                            <NextIcon/>
                        </IconButton>
                    )}
                </Box>
            </Popover>
        </>
    )
}

export default Votantes
