import React, {Fragment} from 'react';
import { TextField } from '@material-ui/core';

const renderSelectField = ({
    id,
    data,
    helperText,
    error,
    onBlur,
    onChange,
    label,
    placeholder,
    name,
    value,
}) => {
    return (
        <Fragment>
            {/* <label style={{ fontFamily: 'Arial', font:'Regular', fontSize:'1.125em' }} >{label}</label> */}
            <TextField
                style={{ marginTop: '0.625em', marginBottom: '0.625em' }}
                select
                variant="outlined"
                error={error}
                fullWidth
                helperText={helperText}
                label={label}
                placeholder=""
                onBlur={onBlur}
                onChange={onChange}
                native
                SelectProps={{ native: true }}
                id={id}
                name={name}
                value={value}
                >
                <option>
                    Seleccione una Opcion
                </option>
                {data.map((option) => (
                    <option key={option.codigo} value={option.codigo}>
                        {option.contenido}
                    </option>
                ))}
            </TextField>
        </Fragment>
    );
};

export default renderSelectField;
