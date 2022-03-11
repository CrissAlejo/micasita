import React, { Fragment } from 'react';
import { TextField } from '@material-ui/core';

const renderTextAreaField = ({
    id,
    name,
    label,
    placeholder,
    error,
    helperText,
    onBlur,
    onChange,
    value,
}) => {
    return (
        <Fragment>
            {/* <label style={{ fontFamily: 'Arial', font: 'Regular', fontSize:'1.125em' }} >{label}</label> */}
            <TextField
                style={{ marginTop: '0.625em', marginBottom: '0.625em' }}
                error={error}
                fullWidth
                helperText={helperText}
                label={label}
                placeholder=""
                name={name}
                id={id}
                onBlur={onBlur}
                onChange={onChange}
                defaultValue={value}
                variant="outlined"
                multiline
            />
        </Fragment>
    );
};

export default renderTextAreaField;