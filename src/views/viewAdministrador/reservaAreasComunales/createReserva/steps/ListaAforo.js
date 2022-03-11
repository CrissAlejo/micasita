import { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";

function horasLbl(hora){
    let date = new Date(0)
    let seconds = hora * 3600
    date.setSeconds(seconds)
    return date.toISOString().substr(11,5)
}

export const ListaAforo = props => {
    const [listaHoras, setListaHoras] = useState([]);
    const r = ()=>{
        let listadeHoras = [];
        for(let i=1 ; i <= props.aforo.afrDisp; i++){
            listadeHoras.push(i);
        }
        setListaHoras(listadeHoras)
    }
    useEffect(() => {
        r();
    },[])
    return (
        <TextField
            key={props.index}
            error={props.errors.Personas && props.touched.Personas}
            name='Personas'
            variant="outlined"
            fullWidth={true}
            select
            SelectProps={{ native: true }}
            value={props.values[props.index]}
            onChange={(e)=>{props.handlePersonas(e.target.value, props.index);}}
            onBlur={props.handleBlur}
            helperText={props.errors.Personas && props.touched.Personas && props.errors.Personas}
        >
            <option value={""}>
            para {horasLbl(props.hora)} hrs.
            </option>
            {listaHoras.length> 0 && listaHoras.map((e) => (
            <option key={e} value={e}>
                {e}
            </option>
            ))}
        </TextField>
    )
}
