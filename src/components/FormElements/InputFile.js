import React, { Fragment } from 'react';
import { TextField, Button } from '@material-ui/core';


const renderFileField = ({
    id,
    name,
    placeholder,
    error,
    helperText,
    onBlur,
    onChange,
    label,
    value,
    disabled,
    classStyle
}) => {
    return (
        <Fragment>
            <label htmlFor={name}>
                <input
                    style={{ display: "none" }}
                    error={error}
                    fullWidth
                    helperText={helperText}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    type="file"
                    onBlur={onBlur}
                    onChange={onChange}
                    defaultValue={value}
                    disabled={disabled}
                />
                <Button color="secondary" variant="contained" component="span" style={{ marginBottom: '20px', marginTop: '20px' }}>
                    {label}
                </Button>{" "}
            </label>
        </Fragment>
    );
};

export default renderFileField;