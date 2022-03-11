import React, { Fragment } from 'react';
import { TextField } from '@material-ui/core';


const renderTextField = ({
    id,
    name,
    label,
    placeholder,
    error,
    helperText,
    onBlur,
    onChange,
    value,
    disabled,
    type,
    classStyle
}) => {
    return (
        <Fragment>
            {/* <label style={{ fontFamily: 'Arial', font: 'Regular', fontSize:'1.125em' }} >{label}</label> */}
            <TextField
                style={
                    classStyle == 'home' ?
                        { border: '3px solid #002543', marginTop: '0.625em', marginBottom: '0.625em', borderRadius: '0em 0em 0em 0em'}
                            :
                        { marginTop: '0.625em', marginBottom: '0.625em', borderRadius: '0em 0em 0em 0em' }
                    }
                error={error}
                fullWidth
                helperText={helperText}
                label={type != 'date' ? label : ''}
                placeholder={placeholder}
                name={name}
                id={id}
                type={type == 'null' ? 'text' : type}
                onBlur={onBlur}
                onChange={onChange}
                defaultValue={value}
                variant="outlined"
                disabled={disabled}
            />
        </Fragment>
    );
};

export default renderTextField;